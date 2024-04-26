import React from "react";

import { auth } from "@clerk/nextjs/server";

import { checkPermissions } from "~/actions/security/permissions";
import { type UserRole } from "~/server/db/schema";

type PermissionProps = {
	children: React.ReactNode;
	allowRoles: UserRole[];
	projectId: number;
	any?: boolean;
};

async function Permission({
	children,
	allowRoles,
	projectId,
	any = false,
}: PermissionProps) {
	const { userId }: { userId: string | null } = auth();

	if (!userId) return null;
	if (any) return <>{children}</>;

	try {
		await checkPermissions(userId, projectId, allowRoles);
		return <>{children}</>;
	} catch (error) {
		return null;
	}
}

export default Permission;
