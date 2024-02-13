"use server";

import { getAverageColor } from "fast-average-color-node";
import { generateProjectImage } from "../ai-action";
import chroma from "chroma-js";
import { kv } from "@vercel/kv";
import { db } from "~/server/db";
import {
	type NewProject,
	projects,
	insertProjectSchema,
} from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { addUserToProject } from "../user-actions";
import { type CreateForm } from "../project-actions";
import { addMinutes, startOfDay } from "date-fns";
import { createSprintForProject } from "../sprint-actions";
import { authenticate } from "../utils/action-utils";
import { createInvite } from "../invite-actions";

type ProjectResponse = {
	newProjectId: number;
	inviteToken: string | null;
	status: boolean;
	message: string;
};

export async function createProject(
	data: CreateForm,
): Promise<ProjectResponse> {
	try {
		const userId = authenticate();
		if (!userId) {
			return {
				newProjectId: -1,
				inviteToken: null,
				status: false,
				message: "Authentication failed",
			};
		}

		// modify project data to account for timezone
		data.sprintStart = addMinutes(
			startOfDay(data.sprintStart),
			data.timezoneOffset,
		);

		// insert project
		const newProject: NewProject = insertProjectSchema.parse(data);
		const result = await db.insert(projects).values(newProject);
		const insertId = parseInt(result.insertId);

		// add user to project
		const addUser = await addUserToProject(userId, insertId, "owner");
		if (!addUser) {
			return {
				newProjectId: -1,
				inviteToken: null,
				status: false,
				message: "Error adding user to project",
			};
		}

		// create sprint for project
		await createSprintForProject(insertId);

		// create invite token
		const token = await createInvite(userId, String(insertId));
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
			message: "Project created successfully",
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
		// generate image
		const image = await generateProjectImage(
			projectName,
			projectDescription,
		);
		if (!image) {
			console.error("Error generating project image");
			return;
		}

		//  get average color
		await getAverageColor(image).then(async (color: { hex: string }) => {
			const hex = color.hex;
			const vibrant = chroma(hex).darken(1).saturate(2).hex();
			// store project color in Redis
			await kv.set("project-color-" + projectId, vibrant);
		});

		// update project image
		await db
			.update(projects)
			.set({ image: image })
			.where(eq(projects.id, projectId));
		console.log("Project image generated and updated successfully.");
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
