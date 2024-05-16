"use server";

import { put } from "@vercel/blob";
import { addMinutes, startOfDay } from "date-fns";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";
import sharp from "sharp";

import { createSprintForProject } from "~/actions/application/sprint-actions";
import { authenticate } from "~/actions/security/authenticate";
import { autoColor } from "~/actions/settings/settings-actions";
import { addUserToProject } from "~/actions/user-actions";
import { env } from "~/env.mjs";
import { db } from "~/server/db";
import {
	type NewProject,
	projects,
	insertProjectSchema,
} from "~/server/db/schema";

import { createInvite } from "./invite-actions";

type ProjectResponse = {
	newProjectId: number;
	inviteToken: string | null;
	status: boolean;
	message: string;
};

export type CreateForm = {
	name: NewProject["name"];
	description?: string;
	sprintDuration: number;
	sprintStart: Date;
	invitees: string[];
	timezoneOffset: number;
};

export async function createProject(
	data: CreateForm,
): Promise<ProjectResponse> {
	try {
		const userId = authenticate();

		// modify project data to account for timezone
		data.sprintStart = addMinutes(
			startOfDay(data.sprintStart),
			data.timezoneOffset,
		);

		// insert project
		const newProject: NewProject = insertProjectSchema.parse(data);
		const result = await db.insert(projects).values(newProject).returning();
		console.log("🚀 - Project created:", result);
		const insertId = result[0]?.id;
		if (!insertId) {
			return {
				newProjectId: -1,
				inviteToken: null,
				status: false,
				message: "Error creating project",
			};
		}

		console.log("🤖 - Project created");

		// add user to project
		await addUserToProject(userId, insertId, "owner");

		// create sprint for project
		await createSprintForProject();

		// create invite token
		const token = await createInvite(insertId);
		if (!token) {
			return {
				newProjectId: -1,
				inviteToken: null,
				status: false,
				message: "Error creating invite token",
			};
		}

		// generate project image in background
		void generateAndUpdateProjectImage(
			insertId,
			newProject.name,
			newProject.description,
		);

		return {
			newProjectId: insertId,
			inviteToken: token,
			status: true,
			message: `Project "${newProject.name}" created`,
		};
	} catch (error) {
		return handleCreateProjectError(error);
	}
}

export async function generateAndUpdateProjectImage(
	projectId: number,
	projectName: string,
	projectDescription: string | null | undefined,
) {
	try {
		console.log("🤖 - generateAndUpdateProjectImage");
		// generate image
		const image = await generateProjectImage(
			projectName,
			projectDescription,
		);
		if (!image) {
			console.error("Error generating project image");
			return;
		}

		const color = await autoColor(image);

		await db
			.update(projects)
			.set({ image: image, color: color })
			.where(eq(projects.id, projectId));

		revalidatePath("/");
	} catch (error) {
		console.error("Error generating or updating project image:", error);
	}
}

function handleCreateProjectError(error: unknown) {
	if (error instanceof Error) {
		if (error.message.includes("Duplicate entry")) {
			return {
				newProjectId: -1,
				inviteToken: null,
				status: false,
				message: "Project name already exists",
			};
		}
		return {
			newProjectId: -1,
			inviteToken: null,
			status: false,
			message: error.message,
		};
	} else {
		return {
			newProjectId: -1,
			inviteToken: null,
			status: false,
			message: "Unknown error",
		};
	}
}

export async function generateProjectImage(
	name: string,
	description: string | null | undefined,
) {
	const client = new OpenAI();
	console.log("🤖 - Generating image for", name, description);
	const object = await imageGenerationHelper(name, description);
	if (!object) {
		console.error("🤖 - Error generating image object");
		return;
	}

	// in light blue metallic iridescent material
	const response = await client.images.generate({
		model: "dall-e-3",
		prompt: `an icon of a ${object}, 3D render isometric perspective on dark background`,
		n: 1,
		size: "1024x1024",
	});

	const image_url = response?.data?.[0]?.url;
	if (!image_url) {
		return;
	}

	console.log("🤖 - Finished generating image!");
	const imageResponse = await (await fetch(image_url)).arrayBuffer();
	const imageData = Buffer.from(imageResponse);
	const resizedImage = await sharp(imageData).resize(500).webp().toBuffer();

	const filename = `project_image_generated_${Date.now()}.webp`;
	const blob = await put(filename, resizedImage, {
		access: "public",
		contentType: "image/webp",
	});

	console.log("🤖 - Finished uploading image!", blob);

	return blob.url;
}

async function imageGenerationHelper(
	name: string,
	description: string | null | undefined,
) {
	const openai = new OpenAI({
		apiKey: env.OPENAI_API_KEY,
	});

	const gptResponse = await openai.chat.completions.create({
		messages: [
			{
				role: "assistant",
				content: `
				RESPOND WITH A SINGLE OBJECT, OR SIMPLE DESCRIPTION OF THE OBJECT!

				Given this project name "${name}" and description "${description}", what 
				is an icon that represents this project?

				Example:
				- Project name = "Test" and description = "This is a test project"
				- Icon = "A Test-tube"

				- Project name = "Demo" and description = "This is a demo project"
				- Icon = <You will need to be creative>

				Please include the color and the material of the icon in your response.
            `,
			},
		],
		model: "gpt-4o",
	});

	if (!gptResponse.choices[0]?.message.content) {
		return;
	}

	return gptResponse.choices[0]?.message.content;
}
