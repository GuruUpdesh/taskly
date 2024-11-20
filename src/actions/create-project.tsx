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

export async function createProject(
	data: CreateForm,
): Promise<ProjectResponse> {
	try {
		const userId = await authenticate();
		const childLogger = logger.child({ userId, data });
		childLogger.info("[CREATE PROJECT]");

		// modify project data to account for timezone
		data.sprintStart = addMinutes(
			startOfDay(data.sprintStart),
			data.timezoneOffset,
		);

		// insert project
		const newProject: NewProject = insertProjectSchema.parse(data);
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
		await createSprintForProject();

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
		console.error(error);
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
