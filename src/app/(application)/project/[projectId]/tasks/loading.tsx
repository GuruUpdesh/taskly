import { Skeleton } from "~/components/ui/skeleton";
import LoadingFilters from "~/features/tasks/components/backlog/filters/LoadingFilters";
import LoadingTaskList from "~/features/tasks/components/LoadingTaskList";

export default function Loading() {
	return (
		<div className="pt-2">
			<header className="container flex h-[45px] items-center justify-between gap-2 border-b pb-2">
				<Skeleton className="h-[20px] w-[25%]" />
				<Skeleton className="h-[36px] w-[25%]" />
			</header>
			<LoadingFilters />
			<LoadingTaskList />
		</div>
	);
}
