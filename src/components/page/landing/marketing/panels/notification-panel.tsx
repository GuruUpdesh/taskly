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
	[
		{ title: "Copied to Clipboard", type: "info" },
		{ title: "Task finished successfully", type: "success" },
		{ title: "New feedback on task", type: "info" },
		{ title: "Issue in task processing", type: "error" },
		{ title: "AI Task Creation Completed", type: "error" },
	],
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
	[
		{ title: "Copied to Clipboard", type: "info" },
		{ title: "Task finished successfully", type: "success" },
		{ title: "New feedback on task", type: "info" },
		{ title: "Issue in task processing", type: "error" },
		{ title: "AI Task Creation Completed", type: "error" },
	],
];

const NotificationPanel = () => {
	return (
		<div className="flex max-h-[300px] -translate-x-10 -translate-y-10 -rotate-45 flex-col gap-4">
			{notificationData.map((group, index) => (
				<div
					key={index}
					className={cn(
						`ease-slow flex items-center gap-4 transition-transform duration-1000`,
						{
							"group-hover:translate-x-[-72%]": index === 0,
							"group-hover:translate-x-[-150%]": index === 1,
							"translate-x-[-25%] group-hover:translate-x-[-105%]":
								index === 2,
							"translate-x-[-25%] group-hover:translate-x-[-180%]":
								index === 3,
							"translate-x-[-50%] group-hover:translate-x-[-71%]":
								index === 4,
							"translate-x-[-35%] group-hover:translate-x-[-151%]":
								index === 5,
							"translate-x-[-25%] group-hover:translate-x-[-106%]":
								index === 6,
							"translate-x-[-25%] group-hover:translate-x-[-181%]":
								index === 7,
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
			<p className="whitespace-nowrap text-sm opacity-65">{title}</p>
		</div>
	);
};

export default NotificationPanel;
