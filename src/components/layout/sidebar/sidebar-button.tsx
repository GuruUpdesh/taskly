"use client";

import React, { useMemo } from "react";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
		<Button
			variant="ghost"
			size="sm"
			className={cn(
				"group/button relative w-full justify-center gap-2 rounded-xl p-0 font-medium text-foreground opacity-50 transition-all hover:opacity-100 @sidebar:justify-start @sidebar:px-4",
				active &&
					"opacity-100 before:absolute before:-left-3 before:top-[50%] before:h-[80%] before:w-1 before:translate-y-[-50%] before:rounded-r before:bg-foreground before:content-['']",
				hidden && "hidden",
			)}
			onClick={callback}
			asChild
		>
			<Link
				href={Array.isArray(url) ? url[0]! : url}
				target={openInNewTab ? "_blank" : ""}
			>
				{icon ? icon : null}
				<span className="hidden @sidebar:inline-flex">{label}</span>
				{children}
				{openInNewTab && (
					<>
						<span className="flex-1" />
						<ExternalLink className="h-4 w-4 opacity-0 transition-all group-hover/button:opacity-100" />
					</>
				)}
			</Link>
		</Button>
	);
};

export default SidebarButton;
