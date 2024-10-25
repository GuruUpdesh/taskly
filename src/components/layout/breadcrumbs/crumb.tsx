import React from "react";

import { HomeIcon } from "@radix-ui/react-icons";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "~/lib/utils";

import type { Crumb as TypeCrumb } from "./breadcrumbs";

interface CrumbProps extends TypeCrumb {
	last: boolean;
}

const Crumb = ({ name, link, last }: CrumbProps) => {
	return (
		<div className="flex items-center">
			<div
				className={cn(
					"flex items-center rounded-sm hover:bg-accent",
					last
						? "bg-accent px-2 font-bold"
						: "bg-transparent px-1 text-muted-foreground",
				)}
			>
				<Link
					aria-disabled={last}
					href={link}
					className={cn(
						"flex items-center gap-1 whitespace-nowrap text-sm capitalize",
					)}
				>
					{name === "Home" ? <HomeIcon /> : null}
					{name}
				</Link>
			</div>
			{!last ? (
				<ChevronRight className="my-1 h-4 w-4 text-muted-foreground" />
			) : null}
		</div>
	);
};

export default Crumb;
