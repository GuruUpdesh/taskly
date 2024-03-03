"use client";

import React from "react";

import { BellIcon, GitHubLogoIcon, TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
	deleteTask,
	getTask,
	updateTask,
} from "~/actions/application/task-actions";
import BreadCrumbs from "~/components/layout/breadcrumbs/breadcrumbs";
import BackButtonRelative from "~/components/layout/navbar/back-button-relative";
import { Button } from "~/components/ui/button";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import { Separator } from "~/components/ui/separator";

import PrimaryTaskForm from "./PrimaryTaskForm";
import TaskState from "./task-state";
import Task from "../backlog/task/task";
import { type UpdateTask } from "../backlog/tasks";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import Comments from "./Comment";
import { Comment } from "~/server/db/schema";


type Props = {
	taskId: string;
	projectId: string;
	context: "page" | "inbox";
};

const TaskPage = ({ taskId, projectId, context }: Props) => {
	const queryClient = useQueryClient();
	const router = useRouter();

	const result = useQuery({
		queryKey: ["task", taskId],
		queryFn: () => getTask(parseInt(taskId)),
		staleTime: 6 * 1000,
		refetchInterval: 6 * 1000,
	});

	const editTaskMutation = useMutation({
		mutationFn: ({ id, newTask }: UpdateTask) => updateTask(id, newTask),
		onSettled: () =>
			queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
	});

	const deleteTaskMutation = useMutation({
		mutationFn: (id: number) => deleteTask(id),
		onMutate: () => {
			router.back();
		},
	});

	if (!result.data) {
		return <div>Loading...</div>;
	}

	if (!result.data.success || !result.data.task) {
		return <div>{result.data.message}</div>;
	}

	return (
		<>
			<TaskState task={result.data.task} />
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel id="task" defaultSize={75} minSize={50}>
					<div className="flex flex-col">
						<header className="container flex items-center justify-between gap-2 border-b py-2">
							<div className="flex items-center gap-2">
								{context === "page" && <BackButtonRelative />}
								<BreadCrumbs />
							</div>
						</header>
						<PrimaryTaskForm
							task={result.data.task}
							editTaskMutation={editTaskMutation}
						/>
					</div>
				</ResizablePanel>
				<ResizableHandle className="" />
				<ResizablePanel id="task-info" defaultSize={25} minSize={20}>
					<div className="h-screen bg-accent/25">
						<header className="container flex items-center justify-between gap-2 border-b py-2">
							<div className="flex w-full items-center justify-between gap-2">
								<Button size="icon" variant="outline">
									<BellIcon />
								</Button>
								<Button
									size="icon"
									variant="outline"
									className="flex-1"
								>
									<GitHubLogoIcon />
								</Button>
								<Button variant="outline">
									<TrashIcon />
								</Button>
							</div>
						</header>
						<section className="container flex flex-col gap-2 pt-8">
							<h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
								Attributes
							</h3>
							<Task
								task={result.data.task}
								addTaskMutation={editTaskMutation}
								deleteTaskMutation={deleteTaskMutation}
								variant="list"
								projectId={projectId}
							/>
							<Separator className="my-8" />
							<h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
								Comments
							</h3>
							{/* <Comments taskId={parseInt(taskId)}/> */}
						</section>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</>
	);
};

export default TaskPage;
