"use client";

import React, { useMemo } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BellIcon, Mail, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import SimpleTooltip from "~/components/SimpleTooltip";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "~/components/ui/context-menu";
import {
	type NotificationWithTask,
	readNotification,
	unreadNotification,
	deleteNotification,
} from "~/features/notifications/actions/notification-actions";
import { TaskStatus } from "~/features/tasks/components/RecentTasks";
import { cn } from "~/lib/utils";
import { useAppStore } from "~/store/app";
import typography from "~/styles/typography";
import { formatDateRelative, formatDateVerbose } from "~/utils/dateFormatters";

type Props = {
	notification: NotificationWithTask;
	projectId: string;
};

const NotificationItem = ({ notification, projectId }: Props) => {
	const pathname = usePathname();

	// check if URL ends with Id
	const active = useMemo(() => {
		const path = pathname.split("/");
		return path[path.length - 1] === String(notification.id);
	}, [notification.id, pathname]);

	const queryClient = useQueryClient();
	const deleteNotificationMutation = useMutation({
		mutationFn: (id: number) => deleteNotification(id),
		onMutate: async (id) => {
			await queryClient.cancelQueries({
				queryKey: ["notifications", projectId],
			});
			const previousNotifications = queryClient.getQueryData<
				NotificationWithTask[]
			>(["notifications", projectId]);
			queryClient.setQueryData<NotificationWithTask[]>(
				["notifications", projectId],
				(old) => {
					return old?.filter((n) => n.id !== id);
				},
			);
			return { previousNotifications };
		},
		onError: (err, variables, context) => {
			toast.error(err.message);
			queryClient.setQueryData(
				["notifications", projectId],
				context?.previousNotifications,
			);
		},
		onSettled: () =>
			queryClient.invalidateQueries({
				queryKey: ["notifications", projectId],
			}),
	});

	const toggleReadNotificationMutation = useMutation({
		mutationFn: (id: number) => {
			return notification.readAt
				? unreadNotification(id)
				: readNotification(id);
		},
		onMutate: async (id) => {
			await queryClient.cancelQueries({
				queryKey: ["notifications", projectId],
			});
			const previousNotifications = queryClient.getQueryData<
				NotificationWithTask[]
			>(["notifications", projectId]);
			queryClient.setQueryData<NotificationWithTask[]>(
				["notifications", projectId],
				(old) => {
					return old?.map((n) =>
						n.id === id
							? {
									...n,
									readAt: !n.readAt ? new Date() : null,
								}
							: n,
					);
				},
			);
			return { previousNotifications };
		},
		onSettled: () =>
			queryClient.invalidateQueries({
				queryKey: ["notifications", projectId],
			}),
	});

	function handleClick() {
		if (notification.readAt) return;
		toggleReadNotificationMutation.mutate(notification.id);
	}

	const setHoveredNotificationId = useAppStore(
		(state) => state.setHoveredNotificationId,
	);

	const actions = [
		!active
			? {
					id: notification.readAt ? "markUnRead" : "markRead",
					name: notification.readAt ? "Mark Unread" : "Mark Read",
					icon: <Mail className="h-4 w-4" />,
					shortcut: notification.readAt ? ["u"] : ["r"],
					perform: () => {
						toggleReadNotificationMutation.mutate(notification.id);
					},
					section: `Notification`,
				}
			: null,
		{
			id: "deleteNotification",
			name: "Delete Notification",
			icon: <Trash2 className="h-4 w-4" />,
			shortcut: ["d"],
			perform: () => {
				deleteNotificationMutation.mutate(notification.id);
			},
			section: `Notification`,
		},
	];

	const path = useMemo(() => pathname.split("inbox")[0], [pathname]);

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>
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
					onMouseEnter={() =>
						setHoveredNotificationId(notification.id)
					}
				>
					<SimpleTooltip
						label={
							<div className="max-w-[250px]">
								<p>
									<span>
										{notification.task
											? notification.task.title
											: notification.message}
									</span>{" "}
									{notification.task && (
										<span>{notification.message}</span>
									)}
								</p>
							</div>
						}
						side="right"
					>
						<Link
							href={`${path}inbox/notification/${notification.id}`}
						>
							<div
								onMouseUp={handleClick}
								className={cn(
									"cursor-pointer rounded-none border-b p-4 hover:bg-accent",
									{
										"bg-accent": active,
										"opacity-50":
											notification.readAt !== null,
										"animate-load_background bg-gradient-to-r from-green-500/25 to-transparent to-50% bg-[length:400%]":
											notification.options?.isNew,
									},
								)}
							>
								<div className="flex items-center justify-between gap-2">
									<div
										className={cn(
											"flex min-w-0 items-center gap-2",
											{
												"saturate-0":
													notification.readAt !==
													null,
											},
										)}
									>
										<div className="flex-shrink-0">
											{" "}
											{notification.task ? (
												<TaskStatus
													status={
														notification.task.status
													}
												/>
											) : (
												<div className="flex h-6 w-6 items-center justify-center rounded-full border">
													<BellIcon className="h-4 w-4 text-muted-foreground" />
												</div>
											)}
										</div>
										<div className="min-w-0 flex-1">
											{" "}
											<p className="truncate">
												<span className="mr-1">
													{notification.task
														? notification.task
																.title
														: notification.message}
												</span>
												{notification.task && (
													<span className="text-muted-foreground">
														{notification.message}
													</span>
												)}
											</p>
										</div>
									</div>

									<SimpleTooltip
										label={formatDateVerbose(
											notification.date,
										)}
									>
										<p
											suppressHydrationWarning
											className={cn(
												"flex-shrink-0 whitespace-nowrap",
												typography.paragraph.p_muted,
											)}
										>
											{formatDateRelative(
												notification.date,
											)}
										</p>
									</SimpleTooltip>
								</div>
							</div>
						</Link>
					</SimpleTooltip>
				</motion.div>
			</ContextMenuTrigger>
			<ContextMenuContent>
				{actions.map((action) => {
					if (!action) return null;

					return (
						<ContextMenuItem
							key={action.id}
							onClick={action.perform}
							className="gap-2"
						>
							{action.icon}
							{action.name}
						</ContextMenuItem>
					);
				})}
			</ContextMenuContent>
		</ContextMenu>
	);
};

export default NotificationItem;
