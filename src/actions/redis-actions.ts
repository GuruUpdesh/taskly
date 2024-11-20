"use server";

import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";
import { z } from "zod";

import { authenticate } from "~/actions/security/authenticate";
import { logger } from "~/lib/logger";
import { type Project, selectProjectSchema } from "~/schema";

import { getAllProjects } from "./project-actions";

export async function updateUserApplicationData(pathname: string) {
	const user = await auth();

	if (!user || !user.userId) {
		return;
	}

	await kv.set(user.userId, { lastApplicationPath: pathname });
}

export async function getUserApplicationData() {
	const userId = await authenticate();

	const childLogger = logger.child({ userId });
	childLogger.info("[APP ROUTER]");

	const projectsForUser = await getAllProjects(userId);
	childLogger.debug(
		{ projectsForUser: projectsForUser?.map((p) => p.id) },
		"[APP ROUTER] projects for user",
	);

	let validUrlPrefix = [] as string[];
	if (projectsForUser) {
		validUrlPrefix = projectsForUser.map(
			(project) => `/project/${project.id}`,
		);
	}
	childLogger.debug({ validUrlPrefix }, "[APP ROUTER] valid URL Prefixes");

	const data = await kv.get(userId);
	const dataValidation = UserApplicationDataSchema.safeParse(data);
	if (!dataValidation.success) {
		childLogger.warn("[APP ROUTER] validation failed");
		if (validUrlPrefix.length === 0) {
			childLogger.info("[APP ROUTER] -> create project");
			return { lastApplicationPath: "/create-project" };
		} else if (validUrlPrefix[0]) {
			childLogger.info(`[APP ROUTER] -> ${validUrlPrefix[0] + "/tasks"}`);
			return {
				lastApplicationPath: validUrlPrefix[0] + "/tasks",
			};
		}
		childLogger.info("[APP ROUTER] -> home");
		return { lastApplicationPath: "/" };
	}

	const applicationData = dataValidation.data;
	childLogger.debug({ applicationData }, "[APP ROUTER] applicationData");

	// check that applicationData starts with one of the validUrlPrefixes
	const validProjectPaths = validUrlPrefix.filter((prefix) =>
		applicationData.lastApplicationPath.startsWith(prefix),
	);
	if (validProjectPaths.length === 0) {
		childLogger.warn("[APP ROUTER] No valid project paths");
		if (validUrlPrefix.length === 0) {
			childLogger.info(
				"[APP ROUTER] -> create project (User has no projects)",
			);
			return { lastApplicationPath: "/create-project" };
		} else if (validUrlPrefix[0]) {
			childLogger.info(`[APP ROUTER] -> ${validUrlPrefix[0] + "/tasks"}`);
			return {
				lastApplicationPath: validUrlPrefix[0] + "/tasks",
			};
		}
	}

	return applicationData;
}

const UserApplicationDataSchema = z.object({
	lastApplicationPath: z.string(),
});

export async function updateProjectApplicationData(project: Project) {
	const userId = await authenticate();
	if (!userId) {
		return;
	}

	await kv.set(userId + "projectApplicationData", project);
}

export async function getProjectApplicationData() {
	const userId = await authenticate();
	if (!userId) {
		return;
	}

	const data = (await kv.get(userId + "projectApplicationData")) as Project;

	if (!data) {
		return;
	}

	data.sprintStart = new Date(data.sprintStart);
	const result = selectProjectSchema.safeParse(data);

	if (!result.success) {
		return;
	}

	return result.data;
}
