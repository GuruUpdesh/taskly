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

import Comments from "./comments/Comments";
import PrimaryTaskForm from "./PrimaryTaskForm";
import TaskState from "./task-state";
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
					order={1}
				>
					<div className="flex h-screen max-h-screen flex-col bg-[#081020]">
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
						</section>
						<Separator className="my-4" />
						<div className="relative z-10">
							<h3 className="scroll-m-20 px-6 pb-2 text-xl font-semibold tracking-tight">
								Comments
							</h3>
							<div className="pointer-events-none absolute left-0 top-0 -z-10 h-[135%] w-full bg-gradient-to-t from-transparent to-[#081020] to-25%" />
						</div>
						<Comments
							taskComments={result.data.task.comments}
							taskId={result.data.task.id}
						/>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</>
	);
};

export default TaskPage;
