import React from "react";
import { auth } from "@clerk/nextjs";
import { checkPermission } from "../../actions/project-actions";

type PermissionProps = {
	children: React.ReactNode;
	allowRoles: string[];
	projectId: number;
};

async function Permission({
	children,
	allowRoles,
	projectId,
}: PermissionProps) {
	const { userId }: { userId: string | null } = auth();

	if (!userId) return null;

	const isAuthorized = await checkPermission(projectId, userId, allowRoles);

	if (isAuthorized) {
		return <>{children}</>;
	} else return null;
}

export default Permission;
