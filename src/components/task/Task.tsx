"use client";

import React from "react";

import { BellIcon, GitHubLogoIcon, TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import UserComment from "./UserComment";
import Task from "../backlog/task/task";
import { type UpdateTask } from "../backlog/tasks";
import ToggleSidebarButton from "../layout/sidebar/toggle-sidebar-button";

type Props = {
	taskId: string;
	projectId: string;
	context: "page" | "inbox";
	defaultLayout?: number[];
};

const TaskPage = ({
	taskId,
	projectId,
	context,
	defaultLayout = [75, 25],
}: Props) => {
	const queryClient = useQueryClient();
	const router = useRouter();

	const result = useQuery({
		queryKey: ["task", taskId],
		queryFn: () => getTask(parseInt(taskId)),
		staleTime: 6 * 1000,
		refetchInterval: 6 * 1000,
	});

	const editTaskMutation = useMutation({
		mutationFn: ({ id, newTask }: UpdateTask) => {
			console.log("newTask", newTask);
			return updateTask(id, newTask);
		},
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
		router.push(`/project/${projectId}/backlog`);
		deleteTaskMutation.mutate(parseInt(taskId));
		toast.success("Task deleted");
	}

	if (!result.data) {
		return <div>Loading...</div>;
	}

	if (!result.data.success || !result.data.task) {
		return <div>{result.data.message}</div>;
	}

	const onLayout = (sizes: number[]) => {
		document.cookie = `react-resizable-panels:taskLayout=${JSON.stringify(sizes)}`;
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
				>
					<div className="flex max-h-screen flex-col overflow-y-scroll">
						<header className="sticky top-0 z-50 flex items-center justify-between gap-2 border-b bg-background/75 px-4 py-2 pb-2 pt-2 backdrop-blur-xl">
							<div className="flex items-center gap-2">
								<ToggleSidebarButton />
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
				<ResizablePanel
					id="task-info"
					defaultSize={defaultLayout?.[1]}
					minSize={20}
				>
					<div className="h-screen bg-accent/25">
						<header className="flex items-center justify-between gap-2 border-b px-6 py-2 pb-2 pt-2">
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
								<Button
									variant="outline"
									onClick={handleDelete}
								>
									<TrashIcon />
								</Button>
							</div>
						</header>
						<section className="flex flex-col gap-2 px-6 pt-8">
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
							<UserComment
								comment={{
									id: 1,
									userId: "demo",
									user: {
										userId: "demo",
										username: "gsingh1",
										profilePicture:
											"https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yYjZ0TlJ1cEJjZ1BqSEoyUG1OTU9GdEVXTm0ifQ",
									},
									propertyKey: "assignee",
									propertyValue: "gsingh1",
									taskId: 150,
									oldPropertyValue: null,
									insertedDate: new Date(),
									comment:
										"This is a modified comment for demo purposes, Lauren Ipsum is a great tool for this. I am going to use it for the next project. This is AI generated text, I am not sure if it is going to be useful for the project. I am going to use it for the next project. This is AI generated text, I am not sure if it is going to be useful for the project. I am going to use it for the next project. This is AI generated text, I am not sure if it is going to be useful for the project. I am going to use it for the next project. This is AI generated text, I am not sure if it is going to be useful for the project. I am going to use it for the next project. This is AI generated text, I am not sure if it is going to be useful for the project. I am going to use it for the next project. This is AI generated text, I am not sure if it is going to be useful for the project. I am going to use it for the next project. This is AI generated text, I am not sure if it is going to be useful for the project.",
								}}
							/>
						</section>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</>
	);
};

export default TaskPage;
