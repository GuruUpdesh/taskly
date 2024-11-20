import React from "react";

import dynamic from "next/dynamic";

const BreadCrumbs = dynamic(
	() => import("~/components/layout/breadcrumbs/breadcrumbs"),
	{
		ssr: false,
		loading: () => <LoadingBreadCrumbs />,
	},
);
import LoadingBreadCrumbs from "~/components/layout/breadcrumbs/LoadingBreadCrumbs";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
	breadCrumbs?: boolean;
	toggle?: boolean;
};

const PageHeader = React.forwardRef<HTMLDivElement, Props>(
	(
		{ children, className, toggle = true, breadCrumbs = false, ...props },
		ref,
	) => {
		return (
			<header
				className={cn(
					"sticky top-0 z-20 flex items-center justify-between gap-2 rounded-tl-2xl border-b px-4 pb-2 pt-2 backdrop-blur-xl @container",
					className,
				)}
				ref={ref}
				{...props}
			>
				{toggle && (
					<div className="flex items-center gap-2">
						<SidebarTrigger />
						{breadCrumbs && <BreadCrumbs />}
					</div>
				)}
				<div className="flex w-full items-center justify-end gap-2">
					{children}
				</div>
			</header>
		);
	},
);

PageHeader.displayName = "PageHeader";

export default PageHeader;
