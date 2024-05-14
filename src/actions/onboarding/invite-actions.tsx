"use server";

import crypto from "crypto";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { render } from "@react-email/render";
import { differenceInDays } from "date-fns";
import { and, eq } from "drizzle-orm";
import { Resend } from "resend";
import { z } from "zod";

import { authenticate } from "~/actions/security/authenticate";
import { checkPermissions } from "~/actions/security/permissions";
import ProjectInviteEmail from "~/email/project-invite";
import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { invites, users, usersToProjects } from "~/server/db/schema";

import { createNotification } from "../notification-actions";

const getInviteSchema = z.object({
	userId: z.string(),
	projectId: z.number(),
});

export async function createInvite(projectId: number) {
	const userId = authenticate();
	await checkPermissions(userId, projectId);

	const dataObject = { userId: userId, projectId: projectId };
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
	const token = hash.digest("base64").replaceAll("/", "-");
	await db.insert(invites).values({ ...newInvite, token, date: date });
	return token;
}

export async function joinProject(token: string) {
	const userId = authenticate();

	const requestInvite = await db
		.selectDistinct()
		.from(invites)
		.where(eq(invites.token, token));

	if (!requestInvite || requestInvite.length === 0) {
		return { success: false, message: "No invite link was provided" };
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
		await db.insert(usersToProjects).values({
			userId: userId,
			projectId: inviteData.projectId,
			userRole: "member",
		});

		const invitedUser = await db
			.select()
			.from(users)
			.where(eq(users.userId, userId));
		if (invitedUser && invitedUser.length > 0 && invitedUser[0]) {
			await createNotification({
				userId: inviteData.userId,
				message: `${invitedUser[0].username} has joined your project`,
				date: new Date(),
				projectId: inviteData.projectId,
			});
		}

		return {
			success: true,
			message: "You have successfully joined this project",
			projectId: inviteData.projectId,
		};
	} catch (e) {
		return {
			success: true,
			message: "You have already joined this project",
			projectId: inviteData.projectId,
		};
	}
}

export async function sendEmailInvites(
	projectId: number,
	emails: string[],
	projectName = "",
) {
	const { userId } = auth();
	if (!userId) {
		return {
			newProjectId: -1,
			status: false,
			message: "UserId not found",
		};
	}

	// invite users
	const invitees = emails;
	if (!invitees || invitees.length === 0) {
		return {
			status: false,
			message: "Skipping Invites",
		};
	}
	const inviteToken = await createInvite(projectId);
	const user = await clerkClient.users.getUser(userId);

	if (!inviteToken || !user?.username) {
		return {
			status: false,
			message: "Invites failed to send",
		};
	}

	const email = {
		from: "no-reply@tasklypm.com",
		subject: `Invitation to join a project ${projectName} on Taskly`,
		html: render(
			<ProjectInviteEmail
				projectName={projectName}
				token={inviteToken}
				inviteUserName={user.username}
			/>,
		),
	};
	const resend = new Resend(env.RESEND_API_KEY);

	// send emails
	await Promise.all(
		invitees.map((emailTo) =>
			resend.emails.send({ ...email, to: emailTo }),
		),
	);

	return {
		status: true,
		message: "Invites sent",
	};
}
