import { z } from "zod";
import crypto from "crypto";
import { db } from "~/server/db";
import { invite } from "~/server/db/schema";
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
		.from(invite)
		.where(
			and(
				eq(invite.userId, data.userId),
				eq(invite.projectId, data.projectId),
			),
		);

	if (currentInvites && currentInvites.length > 0 && currentInvites[0]) {
		const currentInvite = currentInvites[0];
		const age = differenceInDays(date, currentInvite.date);
		if (age < 5) {
			return currentInvite.token;
		}
		await db.delete(invite).where(eq(invite.id, currentInvite.id));
	}
	const hash = crypto.createHash("sha256");
	const stringified = JSON.stringify(newInvite);
	hash.update(stringified);
	const token = hash.digest("base64");
	await db.insert(invite).values({ ...newInvite, token, date: date });
	return token;
}
