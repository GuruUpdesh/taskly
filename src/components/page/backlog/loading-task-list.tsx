import React from "react";

import { Skeleton } from "~/components/ui/skeleton";

const LoadingTaskList = () => {
	return (
		<section className="container flex flex-col pt-4">
			{Array(10)
				.fill(0)
				.map((_, i) => (
					<div
						key={i}
						className="flex h-[47px] items-center justify-between border-b py-2"
					>
						<div className="flex h-full w-[50%] items-center gap-2">
							<Skeleton className="h-full flex-1" />
							<Skeleton className="h-full flex-1" />
							<Skeleton className="h-full flex-1" />
							<Skeleton className="h-full flex-1" />
						</div>
						<Skeleton className="h-full w-[10%]" />
					</div>
				))}
		</section>
	);
};

export default LoadingTaskList;
