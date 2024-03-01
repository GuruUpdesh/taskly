import LoadingTaskList from "~/components/page/backlog/loading-task-list";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="pt-2">
			<header className="container flex h-[45px] items-center justify-between gap-2 border-b pb-2">
				<Skeleton className="h-[20px] w-[25%]" />
				<Skeleton className="h-[36px] w-[25%]" />
			</header>
			<LoadingTaskList />
		</div>
	);
}
