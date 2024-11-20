"use server";

import { addMinutes, startOfDay } from "date-fns";

import { authenticate } from "~/actions/security/authenticate";
import { createSprintForProject } from "~/actions/sprint-actions";
import { addUserToProject } from "~/actions/user-actions";
import { db } from "~/db";
import { createInvite } from "~/features/invite/actions/invite-actions";
import { logger } from "~/lib/logger";
import { type NewProject, projects, insertProjectSchema } from "~/schema";

type ProjectResponse = {
	newProjectId: number;
	inviteToken: string | null;
	status: boolean;
	message: string;
};

export type CreateForm = {
	name: NewProject["name"];
	isAiEnabled: boolean;
	description?: string;
	sprintDuration: number;
	sprintStart: Date;
	invitees: string[];
	timezoneOffset: number;
};

const PROJECT_COLOR_OPTIONS = [
	"#FF6B6B", // Coral Red
	"#4ECDC4", // Turquoise
	"#45B7D1", // Sky Blue
	"#96CEB4", // Sage Green
	"#FFBE0B", // Golden Yellow
	"#FF006E", // Hot Pink
	"#8338EC", // Purple
	"#3A86FF", // Royal Blue
	"#FB5607", // Orange
	"#38B000", // Lime Green
	"#7209B7", // Deep Purple
	"#F15BB5", // Pink
	"#00AFB9", // Teal
	"#0077B6", // Ocean Blue
	"#9B5DE5", // Lavender
];

function getRandomColor(): string {
	const randomIndex = Math.floor(
		Math.random() * PROJECT_COLOR_OPTIONS.length,
	);
	return PROJECT_COLOR_OPTIONS[randomIndex] ?? "#000000"; // Fallback to black
}

export async function createProject(
	data: CreateForm,
): Promise<ProjectResponse> {
	try {
		const userId = await authenticate();
		const childLogger = logger.child({ userId, data });
		childLogger.info("[CREATE PROJECT]");

		// Modify project data to account for timezone
		data.sprintStart = addMinutes(
			startOfDay(data.sprintStart),
			data.timezoneOffset,
		);

		const newProject: NewProject = insertProjectSchema.parse(data);
		newProject.color = getRandomColor();

		const result = await db.insert(projects).values(newProject).returning();
		childLogger.debug({ result }, "[CREATE PROJECT] Created");
		const insertId = result[0]?.id;
		if (!insertId) {
			return {
				newProjectId: -1,
				inviteToken: null,
				status: false,
				message: "Error creating project",
			};
		}

		await addUserToProject(userId, insertId, "owner");
		await createSprintForProject(insertId);

		const tokenResult = await createInvite(insertId);

		if (!tokenResult) {
			return {
				newProjectId: -1,
				inviteToken: null,
				status: false,
				message: "Error creating invite token",
			};
		}

		return {
			newProjectId: insertId,
			inviteToken: tokenResult,
			status: true,
			message: `Project "${newProject.name}" created`,
		};
	} catch (error) {
		logger.error(error);
		return handleCreateProjectError(error);
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
