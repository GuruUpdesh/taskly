"use client";

import React, { useMemo } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import SimpleTooltip from "~/app/components/SimpleTooltip";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export type SidebarButtonProps = {
	label: string;
	url: string | string[];
	icon?: React.ReactNode;
	openInNewTab?: boolean;
	children?: React.ReactNode;
	hidden?: boolean;
	callback?: () => void;
};

const SidebarButton = ({
	label,
	icon,
	url,
	openInNewTab = false,
	children,
	hidden = false,
	callback,
}: SidebarButtonProps) => {
	const pathname = usePathname();
	const active = useMemo(() => {
		if (pathname.includes("inbox")) {
			return Array.isArray(url)
				? url.some((u) => u.includes("inbox"))
				: url.includes("inbox");
		}

		return Array.isArray(url) ? url.includes(pathname) : pathname === url;
	}, [pathname, url]);
	return (
		<SimpleTooltip label={label} side="right">
			<Link
				href={Array.isArray(url) ? url[0]! : url}
				target={openInNewTab ? "_blank" : ""}
				className={cn("flex-1 @sidebar:block", hidden && "hidden")}
			>
				<Button
					variant="ghost"
					size="sm"
					className={cn(
						"relative w-full justify-center gap-2 p-0  font-semibold opacity-75 @sidebar:justify-start @sidebar:px-4",
						active &&
							"border-b border-foreground/15 bg-foreground/5 opacity-100",
					)}
					onClick={callback}
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
