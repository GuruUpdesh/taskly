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
import { db } from "~/db";
import { env } from "~/env.mjs";
import ProjectInviteEmail from "~/features/invite/project-invite-email-template";
import { createNotification } from "~/features/notifications/actions/notification-actions";
import { invites, projects, users, usersToProjects } from "~/schema";

const getInviteSchema = z.object({
	userId: z.string(),
	projectId: z.number(),
});

export async function createInvite(projectId: number) {
	const userId = await authenticate();
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
	const userId = await authenticate();

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

export async function sendEmailInvites(projectId: number, emails: string[]) {
	const { userId } = await auth();
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
	const client = await clerkClient();
	const user = await client.users.getUser(userId);

	if (!inviteToken || !user?.username) {
		return {
			status: false,
			message: "Invites failed to send",
		};
	}

	const projectResults = await db
		.select()
		.from(projects)
		.where(eq(projects.id, projectId));

	if (!projectResults[0]) {
		return {
			status: false,
			message: "Invites failed to send",
		};
	}

	const email = {
		from: "Taskly@tasklypm.com",
		subject: `You are Invited! Join ${projectResults[0].name} on Taskly`,
		html: render(
			<ProjectInviteEmail
				projectName={projectResults[0].name}
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
