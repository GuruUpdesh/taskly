import React from "react";

import { Skeleton } from "~/components/ui/skeleton";

const LoadingTaskList = () => {
	return (
		<section className="flex flex-col">
			{Array(8)
				.fill(0)
				.map((_, i) => (
					<div
						key={i}
						className="flex h-[47px] items-center justify-between border-b border-border/50 py-2 "
					>
						<div className="flex h-full w-[70%] items-center gap-2 pl-4">
							<Skeleton className="aspect-square h-full max-w-[30px] flex-1" />
							<Skeleton className="aspect-square h-full max-w-[30px] flex-1" />
							<Skeleton className="h-full max-w-[200px] flex-1" />
						</div>
						<div className="flex h-full items-center gap-2 pr-4">
							<Skeleton className="h-full w-[100px] flex-1" />
							<Skeleton className="aspect-square h-full max-w-[30px] flex-1" />
							<Skeleton className="aspect-square h-full max-w-[30px] flex-1" />
							<Skeleton className="aspect-square h-full max-w-[30px] flex-1" />
						</div>
					</div>
				))}
		</section>
	);
};

export default LoadingTaskList;
