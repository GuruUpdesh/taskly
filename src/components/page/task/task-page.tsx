"use client";

import React, { useEffect } from "react";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "../../ui/resizable";
import BreadCrumbs from "../../layout/breadcrumbs/breadcrumbs";
import PrimaryTaskForm from "./primary-task-form";
import type { NewTask, User } from "~/server/db/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTask, updateTask } from "~/actions/task-actions";
import SecondaryTaskForm from "./secondary-task-form";
import { Button } from "../../ui/button";
import { BellIcon, GitHubLogoIcon, TrashIcon } from "@radix-ui/react-icons";
import { Separator } from "../../ui/separator";
import BackButtonRelative from "../../layout/navbar/back-button-relative";
import TaskState from "./task-state";
import { toast } from "sonner";

type Props = {
	taskId: string;
	assignees: User[];
};

const Task = ({ taskId, assignees }: Props) => {
	const queryClient = useQueryClient();

	const result = useQuery({
		queryKey: ["task", taskId],
		queryFn: () => getTask(parseInt(taskId)),
		staleTime: 6 * 1000,
		refetchInterval: 6 * 1000,
	});

	const editTaskMutation = useMutation({
		mutationFn: (newTask: NewTask) => updateTask(parseInt(taskId), newTask),
		onSettled: () =>
			queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
	});

	// error and loading states
	useEffect(() => {
		if (result.error && result.error instanceof Error) {
			toast.error(result.error.message);
		}

		if (result.data && result.data.status === "error") {
			toast.error(result.data.error.message, {
				description: result.data.error.description,
			});
		}
	}, [result.error, result.data?.status]);

	if (!result.data || result.data.status === "error") {
		return (
			<div className="flex w-full items-center justify-center">
				{result.isLoading && <div>Loading...</div>}
				{result.error && <div>{result.error.message}</div>}
				{result.data && result.data.status === "error" && (
					<div>{result.data.error.message}</div>
				)}
			</div>
		);
	}

	const task = result.data.data;

	return (
		<>
			<TaskState task={task} />
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel id="task" defaultSize={75} minSize={50}>
					<div className="flex flex-col">
						<header className="container flex items-center justify-between gap-2 border-b py-2">
							<div className="flex items-center gap-2">
								<BackButtonRelative />
								<BreadCrumbs />
							</div>
						</header>
						<PrimaryTaskForm
							task={task}
							editTaskMutation={editTaskMutation}
						/>
					</div>
				</ResizablePanel>
				<ResizableHandle className="" />
				<ResizablePanel id="task-info" defaultSize={25} minSize={20}>
					<div className="h-screen bg-accent/50">
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
							<SecondaryTaskForm
								task={task}
								assignees={assignees}
								editTaskMutation={editTaskMutation}
							/>
							<Separator className="my-8" />
							<h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
								Comments
							</h3>
							<div className="rounded-lg border bg-background p-4">
								<div className=""></div>
							</div>
						</section>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</>
	);
};

export default Task;
