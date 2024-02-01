"use server";

import { auth } from "@clerk/nextjs";
import { kv } from "@vercel/kv";
import { z } from "zod";
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
	const data = await kv.get(user.userId);

	if (!data) {
		const projectsForUser = await getAllProjects(user.userId);
		if (!projectsForUser || projectsForUser.length === 0) {
			return { lastApplicationPath: "/project" };
		} else {
			if (projectsForUser.length === 1 && projectsForUser[0]) {
				return {
					lastApplicationPath:
						"/project/" + projectsForUser[0].id + "/backlog",
				};
			}
		}
		return { lastApplicationPath: "/" };
	}

	const parsedData = UserApplicationDataSchema.parse(data);

	return parsedData;
}

const UserApplicationDataSchema = z.object({
	lastApplicationPath: z.string(),
});
