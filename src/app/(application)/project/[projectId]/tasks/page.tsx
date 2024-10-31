import { currentUser } from "@clerk/nextjs/server";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { type Metadata } from "next";
import dynamic from "next/dynamic";

import { getTasksFromProject } from "~/actions/task-actions";
import CreateGithubTicket from "~/components/CreateGithubTicket";
import LoadingBreadCrumbs from "~/components/layout/breadcrumbs/LoadingBreadCrumbs";
import { Button } from "~/components/ui/button";
import { SidebarTrigger } from "~/components/ui/sidebar";
import AiDialog from "~/features/ai/components/AiDialog";
import FilterAndGroupToggles from "~/features/tasks/components/backlog/filters/FilterAndGroupToggles";
import LoadingFilters from "~/features/tasks/components/backlog/filters/LoadingFilters";
import TasksContainer from "~/features/tasks/components/backlog/TasksContainer";
import CreateTask from "~/features/tasks/components/CreateTask";

export const metadata: Metadata = {
	title: "Tasks",
};

const BreadCrumbs = dynamic(
	() => import("~/components/layout/breadcrumbs/breadcrumbs"),
	{
		ssr: false,
		loading: () => <LoadingBreadCrumbs />,
	},
);
const Filters = dynamic(
	() => import("~/features/tasks/components/backlog/filters/Filters"),
	{
		ssr: false,
		loading: () => <LoadingFilters />,
	},
);

type Params = {
	params: {
		projectId: string;
	};
};

export default async function BacklogPage({ params: { projectId } }: Params) {
	// Prefetch tasks using react-query
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey: ["tasks", projectId],
		queryFn: () => getTasksFromProject(parseInt(projectId)),
	});
	const user = await currentUser();

	return (
		<div className="relative flex max-h-screen flex-1 flex-col overflow-y-scroll">
			<header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b bg-background px-4 pb-2 pt-2 backdrop-blur-xl @container">
				<div className="flex items-center gap-2">
					<SidebarTrigger />
					<BreadCrumbs />
				</div>
				<div className="flex h-9 items-center gap-2">
					<FilterAndGroupToggles />
					<AiDialog projectId={projectId} />
					<CreateTask projectId={projectId}>
						<Button
							className="gap-1 font-bold"
							size="sm"
							variant="secondary"
						>
							<PlusCircledIcon />
							<span className="hidden @3xl:block">New Task</span>
						</Button>
					</CreateTask>
				</div>
			</header>
			<section className="flex flex-1 flex-col">
				<Filters username={user?.username} />
				<HydrationBoundary state={dehydrate(queryClient)}>
					<TasksContainer projectId={projectId} />
				</HydrationBoundary>
			</section>
			<CreateGithubTicket />
		</div>
	);
}
