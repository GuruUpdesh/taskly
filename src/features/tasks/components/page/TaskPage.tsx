"use client";

import React from "react";

import { ArrowLeftIcon, TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardCopy, GitBranch, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteTask, getTask, updateTask } from "~/actions/task-actions";
import PageHeader from "~/components/layout/PageHeader";
import Message from "~/components/Message";
import SimpleTooltip from "~/components/SimpleTooltip";
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
import { Separator } from "~/components/ui/separator";
import { createComment } from "~/features/comments/actions/create-comment";
import Comments from "~/features/comments/components/Comments";
import { getPRStatusFromGithubRepo } from "~/features/github-integration/actions/get-pr-status-from-github-repo";
import PullRequest from "~/features/github-integration/components/PullRequest";
import Task from "~/features/tasks/components/backlog/Task";
import { type UpdateTask } from "~/features/tasks/components/backlog/TasksContainer";
import { getRefetchIntervals } from "~/lib/refetchIntervals";
import constructToastURL from "~/lib/toast/global-toast-url-constructor";

import LoadingPage from "./LoadingPage";
import PrimaryTaskForm from "./PrimaryTaskForm";
import TaskActivity from "./TaskActivity";
import TaskState from "./TaskState";

type Props = {
	taskId: number;
	projectId: string;
	context: "page" | "inbox";
};

const TaskPage = ({ taskId, projectId, context }: Props) => {
	const queryClient = useQueryClient();
	const router = useRouter();

	const result = useQuery({
		queryKey: ["task", taskId],
		queryFn: () => getTask(taskId),
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

	const pullRequests = useQuery({
		queryKey: ["task-pr", taskId],
		queryFn: () => getPRStatusFromGithubRepo(taskId),
		staleTime: 6 * 1000,
		refetchInterval: getRefetchIntervals().task * 2,
	});

	function handleDelete() {
		router.push(`/project/${projectId}/tasks`);
		deleteTaskMutation.mutate(taskId);
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
		return <LoadingPage />;
	}

	if (result.data.error !== null) {
		router.push(
			constructToastURL(
				result.data.error,
				"error",
				`/project/${projectId}/tasks`,
			),
		);
		return (
			<div className="flex w-full items-center justify-center">
				<Message type="error">{result.data.error}</Message>
			</div>
		);
	}

	return (
		<>
			<TaskState task={result.data.data} />
			<div className="flex h-full">
				{/* Main Task Panel */}
				<div className="flex max-h-[calc(100svh-1rem)] w-3/4 flex-col border-r border-foreground/10">
					<div className="flex-1 overflow-y-auto">
						<PageHeader breadCrumbs>
							<Link href={`/project/${projectId}/tasks`}>
								<Button
									size="sm"
									variant="outline"
									className="flex items-center gap-2 rounded-xl bg-background-dialog"
								>
									<ArrowLeftIcon />
									Tasks
								</Button>
							</Link>
						</PageHeader>
						<PrimaryTaskForm
							task={result.data.data}
							editTaskMutation={editTaskMutation}
							pullRequests={pullRequests.data}
						/>
						<Separator />
						<div className="flex justify-center">
							<section className="flex flex-col gap-2 pb-2">
								{pullRequests.data?.map((pr) => {
									return (
										<PullRequest
											key={pr.number}
											pullRequest={pr}
										/>
									);
								})}
							</section>
							<section className="w-full max-w-[600px]">
								<TaskActivity
									lastViewed={result.data.data.views}
									taskHistory={result.data.data.taskHistory}
								/>
							</section>
						</div>
					</div>
				</div>

				{/* Right Sidebar */}
				<div className="w-1/4 flex-shrink-0 bg-background-dialog">
					<div className="flex h-full flex-col">
						<header className="flex items-center justify-between gap-2 border-b border-foreground/10 px-4 py-2">
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
												!result?.data?.data?.branchName
											) {
												return;
											}
											await navigator.clipboard.writeText(
												result.data.data.branchName,
											);
											toast.info(
												`Copied branch name to clipboard`,
												{
													description:
														result.data.data
															.branchName,
													icon: (
														<GitBranch className="h-4 w-4" />
													),
												},
											);
										}}
									>
										<GitBranch className="h-4 w-4" />
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
							<Task
								task={result.data.data}
								addTaskMutation={editTaskMutation}
								deleteTaskMutation={deleteTaskMutation}
								variant="list"
								projectId={projectId}
							/>
						</section>
						<Separator className="my-4 bg-foreground/10" />
						<section className="comments-container flex-grow overflow-auto px-4 pb-1">
							<Comments
								taskComments={result.data.data.comments}
								taskId={result.data.data.id}
								createComment={createComment}
							/>
						</section>
					</div>
				</div>
			</div>
		</>
	);
};

export default TaskPage;
