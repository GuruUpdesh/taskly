import { z } from "zod";
import crypto from "crypto";
import { db } from "~/server/db";
import { invites, usersToProjects } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import { differenceInDays } from "date-fns";

const getInviteSchema = z.object({
	userId: z.string(),
	projectId: z.number(),
});

export async function createInvite(userId: string, projectId: string) {
	const dataObject = { userId: userId, projectId: parseInt(projectId) };
	const inviteValidation = getInviteSchema.safeParse(dataObject);
	if (!inviteValidation.success) {
		return false;
	}
	const data = inviteValidation.data;
	const date = new Date();
	const newInvite = {
		userId: data.userId,
		projectId: data.projectId,
		date: date.toISOString(),
	};
	const currentInvites = await db
		.select()
		.from(invites)
		.where(
			and(
				eq(invites.userId, data.userId),
				eq(invites.projectId, data.projectId),
			),
		);

	if (currentInvites && currentInvites.length > 0 && currentInvites[0]) {
		const currentInvite = currentInvites[0];
		const age = differenceInDays(date, currentInvite.date);
		if (age < 5) {
			return currentInvite.token;
		}
		await db.delete(invites).where(eq(invites.id, currentInvite.id));
	}
	const hash = crypto.createHash("sha256");
	const stringified = JSON.stringify(newInvite);
	hash.update(stringified);
	const token = hash.digest("base64").replace("/", "-");
	await db.insert(invites).values({ ...newInvite, token, date: date });
	return token;
}

export async function joinProject(token: string, userId: string) {
	const requestInvite = await db
		.selectDistinct()
		.from(invites)
		.where(eq(invites.token, token));
	if (!requestInvite || requestInvite.length === 0) {
		return { success: false, message: "Invalid invite link" };
	}
	const inviteData = requestInvite[0];
	if (!inviteData) {
		return { success: false, message: "Invalid invite link" };
	}
	const date = new Date();
	const age = differenceInDays(date, inviteData.date);

	if (age > 5) {
		return { success: false, message: "Invite link expired" };
	}
	try {
		await db
			.insert(usersToProjects)
			.values({ userId: userId, projectId: inviteData.projectId });
		return {
			success: true,
			message: "You have successfully joined this project",
			projectId: inviteData.projectId
		};
	} catch (e) {
		return {
			success: true,
			message: "You have already joined this project",
			projectId: inviteData.projectId
		};
	}
}
