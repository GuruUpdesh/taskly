import React from "react";

import { cookies } from "next/headers";

import { Skeleton } from "~/components/ui/skeleton";

const LoadingFilters = () => {
	const filtersOpen = cookies().get("filters:state")?.value === "true";

	if (!filtersOpen) return;

	return (
		<div className="border-b bg-background/75 backdrop-blur-xl">
			<div className="flex flex-wrap items-center gap-2 px-4 py-2 text-muted-foreground">
				<p>Filters:</p>
				<Skeleton className="h-[30px] w-[100px] rounded-full" />
				<Skeleton className="aspect-square w-[30px] rounded-full" />
				<div className="flex-1" />
				<Skeleton className="h-[38px] w-[236px] rounded" />
				<Skeleton className="aspect-square w-[20px] rounded-full" />
				<div className="overflow-hidden rounded-lg border"></div>
			</div>
		</div>
	);
};

export default LoadingFilters;
