import React from "react";

import { BellIcon } from "lucide-react";
import { redirect } from "next/navigation";

import SimpleTooltip from "~/components/SimpleTooltip";
import { getNotification } from "~/features/notifications/actions/notification-actions";
import { TaskPageWrapper } from "~/features/tasks/components/page/TaskPageWrapper";
import constructToastURL from "~/lib/toast/global-toast-url-constructor";
import { formatDateRelative, formatDateVerbose } from "~/utils/dateFormatters";

type Params = {
	params: {
		projectId: string;
		notificationId: string;
	};
};

export default async function InboxPage({
	params: { projectId, notificationId },
}: Params) {
	const notification = await getNotification(parseInt(notificationId));

	if (notification === undefined || notification.length === 0) {
		redirect(
			constructToastURL(
				"Issue loading notification",
				"error",
				`/project/${projectId}/inbox`,
			),
		);
	}

	if (notification.length === 0 || notification[0] === undefined) {
		return null;
	}

	if (!notification[0].taskId) {
		return (
			<div className="flex w-full justify-center py-[57px]">
				<div className="flex flex-col gap-2 rounded-lg bg-foreground/5 px-6 py-6">
					<div className="flex items-center gap-2 border-b pb-2">
						<BellIcon className="h-4 w-4" />
						<p className="font-medium">System Notification</p>
						<SimpleTooltip
							label={formatDateVerbose(notification[0].date)}
						>
							<p
								suppressHydrationWarning
								className="flex-shrink-0 whitespace-nowrap text-muted-foreground"
							>
								{formatDateRelative(notification[0].date)}
							</p>
						</SimpleTooltip>
					</div>
					<div className="rounded-lg bg-accent p-4">
						{notification[0].message}
					</div>
				</div>
			</div>
		);
	}

	return (
		<TaskPageWrapper
			taskId={notification[0].taskId.toString()}
			projectId={notification[0].projectId.toString()}
			context="inbox"
		/>
	);
}
