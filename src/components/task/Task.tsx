"use client"

import React from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable'
import BreadCrumbs from '../layout/breadcrumbs/breadcrumbs'
import PrimaryTaskForm from './PrimaryTaskForm'
import { NewTask, User } from '~/server/db/schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getTask, updateTask } from '~/actions/task-actions'
import { UpdateTask } from '../backlog/tasks'

type Props = {
    taskId: string;
    projectId: string;
    assignees: User[];
}

const Task = ({taskId, projectId, assignees}: Props) => {
    const queryClient = useQueryClient();

    const result = useQuery({
		queryKey: ["task", taskId],
		queryFn: () => getTask(parseInt(taskId)),
		staleTime: 6 * 1000,
		refetchInterval: 6 * 1000,
	});

    const editTaskMutation = useMutation({
		mutationFn: (newTask: NewTask) => updateTask(parseInt(taskId), newTask),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["task", taskId] }),
	});


    if (!result.data) {
        return <div>Loading...</div>
    }

	if ((!result.data.success || !result.data.task)) {
		return <div>{result.data.message}</div>;
	}

  return (
        <ResizablePanelGroup direction="horizontal">
        <ResizablePanel id="task" defaultSize={75} minSize={50}>
            <div className="h-screen">
                <header className="container flex items-center justify-between gap-2 border-b pb-2">
                    <BreadCrumbs />
                    <div className="flex items-center gap-2">
                    </div>
                </header>
                <PrimaryTaskForm task={result.data.task} assignees={assignees} editTaskMutation={editTaskMutation}/>
            </div>
        </ResizablePanel>
        <ResizableHandle className="" />
        <ResizablePanel id="task-info" defaultSize={25} minSize={15}>
            <div className="h-screen bg-accent/50">
                <header className="container flex items-center justify-between gap-2 border-b pb-2">
                    <BreadCrumbs />
                    <div className="flex items-center gap-2"></div>
                </header>
                <form className="container ">
                    
                </form>
            </div>
        </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default Task