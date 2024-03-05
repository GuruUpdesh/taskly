"use client";

import React, { useMemo } from "react";

import { format } from "date-fns";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
	type NotificationWithTask,
	readNotification,
} from "~/actions/notification-actions";
import SimpleTooltip from "~/components/general/simple-tooltip";
import { TaskStatus } from "~/components/page/project/recent-tasks";
import { cn } from "~/lib/utils";
import typography from "~/styles/typography";

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
		<motion.div
			initial={{ height: 0, opacity: 0 }}
			animate={{
				height: "auto",
				opacity: 1,
				transition: {
					type: "spring",
					bounce: 0.3,
					opacity: { delay: 0.1 },
					duration: 0.5,
				},
			}}
			exit={{
				height: 0,
				opacity: 0,
				transition: {
					duration: 0.5,
					type: "spring",
					bounce: 0.3,
				},
			}}
		>
			<Link href={`${path}/inbox/notification/${notification.id}`}>
				<SimpleTooltip label={notification.message} side="right">
					<div
						onClick={handleClick}
						className={cn(
							"cursor-pointer rounded-none border-b px-4 py-2 hover:bg-accent",
							{
								"bg-accent opacity-75": active,
								"opacity-50": notification.readAt !== null,
								"animate-load_background bg-gradient-to-r from-green-500/25 to-transparent to-50% bg-[length:400%]":
									notification.options?.isNew,
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
		</motion.div>
	);
};

export default NotificationItem;
