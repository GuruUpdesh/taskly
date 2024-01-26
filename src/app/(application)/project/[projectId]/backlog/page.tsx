import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import Tasks from "./tasks";
import { getTasksFromProject } from "~/actions/task-actions";
import BreadCrumbs from "~/components/layout/breadcrumbs/breadcrumbs";
import { Bot, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import CreateTask from "~/components/backlog/create-task";

type Params = {
	params: {
		projectId: string;
	};
};

export default async function BacklogPage({ params: { projectId } }: Params) {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["tasks"],
		queryFn: () => getTasksFromProject(parseInt(projectId)),
	});
    

	return (
    <div className="pt-2 max-h-screen overflow-y-scroll">
        <header className="flex items-center gap-2 justify-between pb-2 border-b container">
            <BreadCrumbs />
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                    <Bot className="h-4 w-4" />
                </Button>
                <CreateTask projectId={projectId}/>
            </div>
        </header>
        <section className="container flex flex-col pt-4">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Tasks projectId={projectId} />
            </HydrationBoundary>
        </section>
    </div>
	);
}
