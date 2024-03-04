"use client";

import React, { useMemo } from "react";

import { format } from "date-fns";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { readNotification } from "~/actions/notification-actions";
import SimpleTooltip from "~/components/general/simple-tooltip";
import { TaskStatus } from "~/components/page/project/recent-tasks";
import { cn } from "~/lib/utils";
import { type Task, type Notification } from "~/server/db/schema";
import typography from "~/styles/typography";

interface NotificationWithTask extends Notification {
	task: Task;
}

type Props = {
	notification: NotificationWithTask;
};

const NotificationItem = ({ notification }: Props) => {
	const pathname = usePathname();

	// check if URL ends with Id
	const active = useMemo(() => {
		const path = pathname.split("/");
		return path[path.length - 1] === String(notification.id);
	}, [notification.id, pathname]);

	async function handleClick() {
		if (active) return;
		await readNotification(notification.id);
	}

	const path = useMemo(() => pathname.split("inbox")[0], [pathname]);

	return (
		<Link href={`${path}/inbox/notification/${notification.id}`}>
			<SimpleTooltip label={notification.message} side="right">
				<div
					onClick={handleClick}
					className={cn(
						"cursor-pointer rounded-none border-b px-4 py-2 hover:bg-accent",
						{
							"bg-accent opacity-75": active,
							"opacity-50": notification.readAt !== null,
						},
					)}
				>
					<div className="flex items-center justify-between gap-2">
						<p className="flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap">
							{notification.task.title}
						</p>

						<p
							suppressHydrationWarning
							className={cn(
								"whitespace-nowrap",
								typography.paragraph.p_muted,
							)}
						>
							{format(notification.date, "EEE p")}
						</p>
					</div>
					<div className="mt-2 flex items-center justify-between gap-2">
						<TaskStatus status={notification.task.status} />
						<p className="flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap pb-1">
							{notification.message}
						</p>
					</div>
				</div>
			</SimpleTooltip>
		</Link>
	);
};

export default NotificationItem;
