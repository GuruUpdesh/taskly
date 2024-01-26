"use client";

import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { deleteTask, getTasksFromProject, updateTask } from "~/actions/task-actions";
import BacklogItem from "~/components/backlog/backlog-item";
import type { NewTask } from "~/server/db/schema";

export type UpdateTask = {
	id: number;
	newTask: NewTask;
}

type Props = {
	projectId: string;
};

export default function Tasks({ projectId }: Props) {
	const queryClient = useQueryClient();

	const result = useQuery({
		queryKey: ["tasks"],
		queryFn: () => getTasksFromProject(parseInt(projectId)),
		staleTime: 2 * 1000,
		refetchInterval: 6 * 1000,
	});

	const addTaskMutation = useMutation({
		mutationFn: ({id, newTask}: UpdateTask ) => updateTask(id, newTask),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
	})

	const deleteTaskMutation = useMutation({
		mutationFn: (id: number) => deleteTask(id),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
	})

	useEffect(() => {
		if (result.status === "error") {
			toast.error(result.error.message)
		}
	}, [result.status])

	if (!result.data) return <div>Loading...</div>;

	return (
		<div>
			{result.data.map((task) => (
				<BacklogItem key={task.id} task={task} projectId={projectId} addTaskMutation={addTaskMutation} deleteTaskMutation={deleteTaskMutation}  />
			))}
		</div>
	);
}
