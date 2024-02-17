import React from "react";
import { auth } from "@clerk/nextjs";
import { checkPermissions } from "~/actions/security/permissions";
import { type UserRole } from "~/server/db/schema";

type PermissionProps = {
	children: React.ReactNode;
	allowRoles: UserRole[];
	projectId: number;
};

async function Permission({
	children,
	allowRoles,
	projectId,
}: PermissionProps) {
	const { userId }: { userId: string | null } = auth();

	if (!userId) return null;

	try {
		await checkPermissions(userId, projectId, allowRoles);
		return <>{children}</>;
	} catch (error) {
		return null;
	}
}

export default Permission;
