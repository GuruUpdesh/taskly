import React from "react";

import { ChevronRight } from "lucide-react";

import { Skeleton } from "~/components/ui/skeleton";

const LoadingBreadCrumbs = () => {
	return (
		<div className="flex h-[40px] items-center gap-1">
			<Skeleton className="h-5 w-[100px]" />
			<ChevronRight className="my-1 h-4 w-4 text-muted-foreground" />
			<Skeleton className="h-5 w-[100px]" />
		</div>
	);
};

export default LoadingBreadCrumbs;
