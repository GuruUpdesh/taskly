import { zodResolver } from "@hookform/resolvers/zod";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getAsigneesForProject } from "~/actions/project-actions";
import { getTask } from "~/actions/task-actions";
import BreadCrumbs from "~/components/layout/breadcrumbs/breadcrumbs";
import PrimaryTaskForm from "~/components/task/PrimaryTaskForm";
import Task from "~/components/task/Task";
import { Input } from "~/components/ui/input";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";
import { Textarea } from "~/components/ui/textarea";
import { NewTask } from "~/server/db/schema";


type Params = {
	params: {
		taskId: string;
		projectId: string;
	};
};

export default async function TaskPage({
	params: { taskId, projectId },
}: Params) {
	const asignees = await getAsigneesForProject(parseInt(projectId));

	// Prefetch tasks using react-query
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["task", taskId],
		queryFn: () => getTask(parseInt(taskId)),
	});

	// const result = await getTask(parseInt(taskId));
	// if (!result?.success || !result.task) {
	// 	return <div>{result?.message}</div>;
	// }

	// const { project, ...task } = result.task;
	// const form = useForm<NewTask>({
	// 	resolver: zodResolver(taskSchema),
	// 	defaultValues: { ...task },
	// });

	return (
		<div className="max-h-screen overflow-y-scroll">
				<HydrationBoundary state={dehydrate(queryClient)}>
					<Task taskId={taskId} projectId={projectId} assignees={asignees} />
				</HydrationBoundary>
			{/* <ResizablePanelGroup direction="horizontal">
				<ResizablePanel id="task" defaultSize={75} minSize={50}>
					<div className="h-screen">
						<header className="container flex items-center justify-between gap-2 border-b pb-2">
							<BreadCrumbs />
							<div className="flex items-center gap-2">
								
							</div>
						</header>
						<PrimaryTaskForm task={task} assignees={asignees}/>
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
			</ResizablePanelGroup> */}
		</div>
	);
}
