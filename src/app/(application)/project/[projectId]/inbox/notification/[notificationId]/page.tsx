import React from "react";

import { redirect } from "next/navigation";

import Message from "~/components/Message";
import { getNotification } from "~/features/notifications/actions/notification-actions";
import { TaskPageWrapper } from "~/features/tasks/components/page/TaskPageWrapper";
import constructToastURL from "~/lib/toast/global-toast-url-constructor";

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
		console.log("task id is null");
		return (
			<Message type="info">
				<p>{notification[0].message}</p>
			</Message>
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
