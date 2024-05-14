"use server";

import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";
import { z } from "zod";

import { authenticate } from "~/actions/security/authenticate";
import { type Project, selectProjectSchema } from "~/server/db/schema";

import { getAllProjects } from "./project-actions";

export async function updateUserApplicationData(pathname: string) {
	const user = auth();

	if (!user || !user.userId) {
		return;
	}

	await kv.set(user.userId, { lastApplicationPath: pathname });
}

export async function getUserApplicationData() {
	const user = auth();

	if (!user || !user.userId) {
		return;
	}

	const projectsForUser = await getAllProjects(user.userId);
	let validUrlPrefix = [] as string[];
	if (projectsForUser) {
		validUrlPrefix = projectsForUser.map(
			(project) => `/project/${project.id}`,
		);
	}
	console.log("Application Router > validUrlPrefix", validUrlPrefix);

	const data = await kv.get(user.userId);
	const dataValidation = UserApplicationDataSchema.safeParse(data);
	if (!dataValidation.success) {
		console.log("Application Router > validation failed");
		if (validUrlPrefix.length === 0) {
			console.log("Application Router -> create project");
			return { lastApplicationPath: "/create-project" };
		} else if (validUrlPrefix[0]) {
			console.log("Application Router -> tasks");
			return {
				lastApplicationPath: validUrlPrefix[0] + "/tasks",
			};
		}
		console.log("Application Router -> home");
		return { lastApplicationPath: "/" };
	}

	const applicationData = dataValidation.data;
	console.log("Application Router > applicationData", applicationData);

	// check that applicationData starts with one of the validUrlPrefixes
	const validProjectPaths = validUrlPrefix.filter((prefix) =>
		applicationData.lastApplicationPath.startsWith(prefix),
	);
	if (validProjectPaths.length === 0) {
		console.log("Application Router > No valid project paths");
		if (validUrlPrefix.length === 0) {
			console.log("Application Router -> create project");
			return { lastApplicationPath: "/create-project" };
		} else if (validUrlPrefix[0]) {
			console.log("Application Router -> tasks");
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
	const userId = authenticate();
	if (!userId) {
		return;
	}

	await kv.set(userId + "projectApplicationData", project);
}

export async function getProjectApplicationData() {
	const userId = authenticate();
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
