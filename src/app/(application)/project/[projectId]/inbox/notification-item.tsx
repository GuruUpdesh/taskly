"use client";

import React, { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "~/lib/utils";

import { Separator } from "~/components/ui/separator";
import { readNotification } from "~/actions/notification-actions";
import { type Task } from "~/server/db/schema";

type Props = {
	id: string;
	date: string;
	message: string;
	read: boolean;
	task: Task;
};

const NotificationItem = ({ id, date, message, read, task }: Props) => {
	const router = useRouter();
	const pathname = usePathname();

	// check if URL ends with Id
	const active = useMemo(() => {
		const path = pathname.split("/");
		return path[path.length - 1] === id;
	}, [id, pathname]);

	async function handleClick() {
		if (active) return;

		await readNotification(parseInt(id));

		// get path before inbox
		const path = pathname.split("inbox")[0];
		router.push(`${path}/inbox/notification/${id}`);
	}

	return (
		<>
			<div
				onClick={handleClick}
				className={cn(
					"cursor-pointer rounded-none p-2 hover:bg-accent",
					active && "bg-accent",
				)}
			>
				<div className="flex items-center justify-between">
					<p
						className={
							read ? "text-muted-foreground" : "font-semibold"
						}
					>
						{message}
					</p>
				</div>
				<div className="flex justify-between">
					<p className="text-muted-foreground">{task.title}</p>
					<p className="text-muted-foreground">{date}</p>
				</div>
			</div>
			<Separator />
		</>
	);
};

export default NotificationItem;
