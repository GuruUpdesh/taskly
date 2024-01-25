import React from "react";
import { Crumb as TypeCrumb } from "./breadcrumbs";
import { cn } from "~/lib/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface CrumbProps extends TypeCrumb {
	last: boolean;
}

const Crumb = ({ name, link, last }: CrumbProps) => {
	return (
		<>
			<div
				className={cn(
					"flex items-center rounded-sm  py-1 hover:bg-accent",
					last
						? "bg-accent px-2 font-bold"
						: "bg-transparent px-1 text-muted-foreground",
				)}
			>
				<Link
					aria-disabled={last}
					href={link}
					className={cn("flex items-center gap-1 text-sm capitalize")}
				>
					{name}
				</Link>
			</div>
			{!last ? (
				<ChevronRight className="my-1 h-4 w-4 text-muted-foreground" />
			) : null}
		</>
	);
};

export default Crumb;
