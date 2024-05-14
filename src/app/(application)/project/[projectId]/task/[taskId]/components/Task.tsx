"use client";

import React, { useEffect } from "react";

import { GitHubLogoIcon, TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, ClipboardCopy, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPanelElement } from "react-resizable-panels";
import { toast } from "sonner";

import { createComment } from "~/actions/application/comment-actions";
import { type getPRStatusFromGithubRepo } from "~/actions/application/github-actions";
import {
	deleteTask,
	getTask,
	updateTask,
} from "~/actions/application/task-actions";
import BreadCrumbs from "~/app/components/layout/breadcrumbs/breadcrumbs";
import BackButtonRelative from "~/app/components/layout/navbar/back-button-relative";
import ToggleSidebarButton from "~/app/components/layout/sidebar/toggle-sidebar-button";
import Message from "~/app/components/Message";
import SimpleTooltip from "~/app/components/SimpleTooltip";
import Task from "~/app/components/task/Task";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import { Separator } from "~/components/ui/separator";
import { getRefetchIntervals } from "~/config/refetchIntervals";
import constructToastURL from "~/lib/toast/global-toast-url-constructor";
import { useAppStore } from "~/store/app";

import Comments from "./comments/Comments";
import PrimaryTaskForm from "./PrimaryTaskForm";
import TaskState from "./TaskState";
import { type UpdateTask } from "../../../(views)/components/TasksContainer";

type Props = {
	taskId: string;
	projectId: string;
	context: "page" | "inbox";
	defaultLayout?: number[];
	pullRequests?: Awaited<ReturnType<typeof getPRStatusFromGithubRepo>>;
};

const TaskPage = ({
	taskId,
	projectId,
	context,
	defaultLayout = [75, 25],
	pullRequests,
}: Props) => {
	const queryClient = useQueryClient();
	const router = useRouter();

	const setRightSidebarWidth = useAppStore(
		(state) => state.setRightSidebarWidth,
	);

	useEffect(() => {
		const rightPanelElement = getPanelElement("task-info");
		if (rightPanelElement) {
			const width = rightPanelElement.getBoundingClientRect().width;
			setRightSidebarWidth(width);
		}
		return () => {
			setRightSidebarWidth(0);
		};
	}, []);

	const result = useQuery({
		queryKey: ["task", taskId],
		queryFn: () => getTask(parseInt(taskId)),
		staleTime: 6 * 1000,
		refetchInterval: getRefetchIntervals().task,
	});

	const editTaskMutation = useMutation({
		mutationFn: ({ id, newTask }: UpdateTask) =>
			updateTask(id, newTask, true),
		onSettled: () =>
			queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
	});

	const deleteTaskMutation = useMutation({
		mutationFn: (id: number) => deleteTask(id),
		onMutate: () => {
			router.back();
		},
	});

	function handleDelete() {
		router.push(`/project/${projectId}/tasks`);
		deleteTaskMutation.mutate(parseInt(taskId));
		toast.error("Task deleted", {
			icon: <TrashIcon className="h-4 w-4" />,
		});
	}

	const handleCopyLinkToClipboard = async () => {
		const protocol = window.location.protocol;
		await navigator.clipboard.writeText(
			protocol +
				"//" +
				window.location.host +
				`/project/${projectId}/task/${taskId}`,
		);
		toast.info("Task link copied to clipboard", {
			icon: <ClipboardCopy className="h-4 w-4" />,
		});
	};

	if (!result.data) {
		return <div>Loading...</div>;
	}

	if (!result.data.success || !result.data.task) {
		let message = "Task not found";
		if (result.data.message) {
			message = result.data.message;
		}

		router.push(
			constructToastURL(message, "error", `/project/${projectId}/tasks`),
		);
		return (
			<div className="flex w-full items-center justify-center">
				<Message type="error">{message}</Message>
			</div>
		);
	}

	const onLayout = (sizes: number[]) => {
		const rightPanelElement = getPanelElement("task-info");
		if (rightPanelElement) {
			const width = rightPanelElement.getBoundingClientRect().width;
			setRightSidebarWidth(width);
		}
		document.cookie = `react-resizable-panels:task-layout=${JSON.stringify(sizes)}`;
	};

	return (
		<>
			<TaskState task={result.data.task} />
			<ResizablePanelGroup
				direction="horizontal"
				onLayout={onLayout}
				id="task-group"
			>
				<ResizablePanel
					id="task"
					defaultSize={defaultLayout?.[0]}
					minSize={50}
					order={0}
				>
					<div className="flex max-h-screen flex-col overflow-y-scroll">
						<header className="sticky top-0 z-50 flex items-center justify-between gap-2 border-b px-4 py-2 pb-2 pt-2 backdrop-blur-xl">
							<div className="flex items-center gap-2">
								{context === "page" && (
									<>
										<ToggleSidebarButton />
										<BackButtonRelative />
									</>
								)}
								<BreadCrumbs />
							</div>
							<div className="flex items-center gap-2">
								{context === "inbox" && (
									<Link
										href={`/project/${projectId}/task/${taskId}`}
									>
										<Button
											size="sm"
											variant="outline"
											className="gap-2 bg-transparent"
										>
											Open
											<ChevronRight className="h-4 w-4" />
										</Button>
									</Link>
								)}
							</div>
						</header>
						<PrimaryTaskForm
							task={result.data.task}
							editTaskMutation={editTaskMutation}
							pullRequests={pullRequests}
						/>
					</div>
				</ResizablePanel>
				<ResizableHandle className="bg-foreground/15" />
				<ResizablePanel
					id="task-info"
					defaultSize={defaultLayout?.[1]}
					minSize={20}
					order={1}
				>
					<div className="flex h-screen max-h-screen flex-col bg-background-dialog">
						<header className="flex items-center justify-between gap-2 border-b border-foreground/10 px-4 py-2 pb-2 pt-2">
							<div className="flex w-full items-center gap-2">
								<SimpleTooltip label="Copy Link">
									<Button
										size="icon"
										variant="outline"
										className="border-foreground/10 bg-transparent"
										onClick={handleCopyLinkToClipboard}
									>
										<LinkIcon className="h-4 w-4" />
									</Button>
								</SimpleTooltip>
								<SimpleTooltip label="Copy Git Branch Name">
									<Button
										size="icon"
										variant="outline"
										className="border-foreground/10 bg-transparent"
										onClick={async () => {
											if (
												!result?.data?.task?.branchName
											) {
												return;
											}
											await navigator.clipboard.writeText(
												result.data.task.branchName,
											);
											toast.info(
												`Copied branch name to clipboard`,
												{
													description:
														result.data.task
															.branchName,
													icon: (
														<GitHubLogoIcon className="h-4 w-4" />
													),
												},
											);
										}}
									>
										<GitHubLogoIcon />
									</Button>
								</SimpleTooltip>
								<div className="flex-1" />
								<Dialog>
									<DialogTrigger asChild>
										<Button
											size="icon"
											variant="outline"
											className="border-foreground/10 bg-transparent"
										>
											<TrashIcon />
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogTitle>Delete Task?</DialogTitle>
										<DialogDescription>
											This can not be undone. Are you sure
											you want to delete this task?
										</DialogDescription>
										<DialogFooter className="sm:justify-start">
											<div className="flex-1" />
											<DialogClose asChild>
												<Button
													type="button"
													variant="secondary"
												>
													Cancel
												</Button>
											</DialogClose>
											<DialogClose asChild>
												<Button
													variant="destructive"
													onClick={handleDelete}
												>
													Delete
												</Button>
											</DialogClose>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</div>
						</header>
						<section className="flex flex-col gap-2 p-4">
							<h3 className="mb-2 scroll-m-20 text-xl font-semibold tracking-tight">
								Attributes
							</h3>
							<Task
								task={result.data.task}
								addTaskMutation={editTaskMutation}
								deleteTaskMutation={deleteTaskMutation}
								variant="list"
								projectId={projectId}
							/>
						</section>
						<Separator className="my-4 bg-foreground/10" />
						<h3 className="scroll-m-20 px-4 text-xl font-semibold tracking-tight">
							Comments
						</h3>
						<section className="comments-container mb-3 mt-2 flex max-w-full flex-grow flex-col gap-4 overflow-scroll px-4 pb-1">
							<Comments
								taskComments={result.data.task.comments}
								taskId={result.data.task.id}
								createComment={createComment}
							/>
						</section>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</>
	);
};

export default TaskPage;
