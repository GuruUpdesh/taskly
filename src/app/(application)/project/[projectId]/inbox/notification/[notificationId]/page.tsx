import React from "react";

import { redirect } from "next/navigation";

import { getNotification } from "~/actions/notification-actions";
import { TaskWrapper } from "~/app/(application)/project/[projectId]/task/[taskId]/components/TaskWrapper";
import Message from "~/app/components/Message";
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
		<TaskWrapper
			taskId={notification[0].taskId.toString()}
			projectId={notification[0].projectId.toString()}
			context="inbox"
		/>
	);
}
