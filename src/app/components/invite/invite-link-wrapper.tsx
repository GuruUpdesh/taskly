"use server";

import React from "react";

import { auth } from "@clerk/nextjs/server";
import dynamic from "next/dynamic";

import { createInvite } from "~/actions/onboarding/invite-actions";
const InviteLink = dynamic(() => import("./invite-link"), { ssr: false });

type Props = {
	projectId: number;
};

const InviteLinkWrapper = async ({ projectId }: Props) => {
	const { userId }: { userId: string | null } = auth();
	if (!userId) return null;
	const token = await createInvite(projectId);
	if (token === false) return null;

	return (
		<div className="flex flex-col">
			<InviteLink token={token} />
		</div>
	);
};

export default InviteLinkWrapper;
