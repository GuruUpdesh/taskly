import React from "react";

import {
	InfoCircledIcon,
	CheckCircledIcon,
	CrossCircledIcon,
	ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

import { cn } from "~/lib/utils";

const notificationData: NotificationItemProps[][] = [
	[
		{ title: "Task assigned to you", type: "info" },
		{ title: "Task completed successfully", type: "success" },
		{ title: "New comment on task", type: "info" },
		{ title: "Error in task execution", type: "error" },
	],
	[
		{ title: "New project initiated", type: "success" },
		{ title: "Approaching project deadline", type: "warning" },
		{ title: "Project status update", type: "info" },
		{ title: "Issue with project creation", type: "error" },
	],
	[
		{ title: "You have been added to a new task", type: "info" },
		{ title: "Task successfully reassigned", type: "success" },
		{ title: "Received a new task comment", type: "info" },
		{ title: "Failed to join the project", type: "error" },
	],
];

const NotificationPanel = () => {
	return (
		<div className="flex flex-col gap-4 mix-blend-overlay">
			{notificationData.map((group, index) => (
				<div
					key={index}
					className={cn(
						`ease-sharp flex items-center gap-4 transition-transform duration-1000`,
						{
							"group-hover:translate-x-[-72%]": index === 0,
							"group-hover:translate-x-[-150%]": index === 1,
							"group-hover:translate-x-[-105%]": index === 2,
						},
					)}
				>
					{group.map((notification, notificationIndex) => (
						<NotificationItem
							key={notificationIndex}
							title={notification.title}
							type={notification.type}
						/>
					))}
				</div>
			))}
		</div>
	);
};

type NotificationItemProps = {
	title: string;
	type: "info" | "warning" | "error" | "success";
};

const NotificationItem = ({ title, type }: NotificationItemProps) => {
	function renderIcon() {
		switch (type) {
			case "info":
				return <InfoCircledIcon />;
			case "warning":
				return <ExclamationTriangleIcon />;
			case "error":
				return <CrossCircledIcon />;
			case "success":
				return <CheckCircledIcon />;
			default:
				return <InfoCircledIcon />;
		}
	}
	return (
		<div className="flex items-center gap-2 rounded-md border bg-accent/50 px-3 py-2 shadow-lg">
			<div className="opacity-75">{renderIcon()}</div>
			<p className="whitespace-nowrap text-sm opacity-50">{title}</p>
		</div>
	);
};

export default NotificationPanel;
