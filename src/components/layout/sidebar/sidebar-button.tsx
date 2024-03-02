"use client";

import React, { useMemo } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import SimpleTooltip from "~/components/general/simple-tooltip";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export type SidebarButtonProps = {
	label: string;
	url: string;
	icon?: React.ReactNode;
	openInNewTab?: boolean;
	children?: React.ReactNode;
	hidden?: boolean;
};

const SidebarButton = ({
	label,
	icon,
	url,
	openInNewTab = false,
	children,
	hidden = false,
}: SidebarButtonProps) => {
	const pathname = usePathname();
	const active = useMemo(() => pathname === url, [pathname, url]);
	return (
		<SimpleTooltip label={label} side="right">
			<Link
				href={url}
				target={openInNewTab ? "_blank" : ""}
				className={cn("flex-1 @sidebar:block", hidden && "hidden")}
			>
				<Button
					variant="ghost"
					size="sm"
					className={cn(
						"w-full justify-center gap-2 p-0 font-semibold  @sidebar:justify-start @sidebar:px-4",
						active && "bg-accent",
					)}
				>
					{icon ? icon : null}
					<span className="hidden @sidebar:inline-flex">{label}</span>
					{children}
				</Button>
			</Link>
		</SimpleTooltip>
	);
};

export default SidebarButton;
