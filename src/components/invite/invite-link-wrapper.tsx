"use server";

import React from "react";
import { auth } from "@clerk/nextjs";
import { createInvite } from "~/actions/invite-actions";
import dynamic from "next/dynamic";
const InviteLink = dynamic(() => import("./invite-link"), { ssr: false });

type Props = {
	projectId: string;
};

const InviteLinkWrapper = async ({ projectId }: Props) => {
	const { userId }: { userId: string | null } = auth();
	if (!userId) return null;
	const token = await createInvite(userId, projectId);
	if (token === false) return null;

	return (
		<div className="container flex flex-col pt-4">
			<h1>Invite with Link</h1>
			<p>Invite a user using the link below!</p>
			<InviteLink token={token} />
		</div>
	);
};

export default InviteLinkWrapper;