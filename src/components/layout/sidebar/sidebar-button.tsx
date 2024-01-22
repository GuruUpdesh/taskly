"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

export type SidebarButtonProps = {
	label: string;
	url: string;
	icon?: React.ReactNode;
	openInNewTab?: boolean;
	children?: React.ReactNode;
};

const SidebarButton = ({
	label,
	icon,
	url,
	openInNewTab = false,
	children,
}: SidebarButtonProps) => {
	const pathname = usePathname();
	const active = useMemo(() => pathname === url, [pathname, url]);
	return (
		<Link href={url} target={openInNewTab ? "_blank" : ""}>
			<Button
				variant="ghost"
				size="sm"
				className={cn(
					"w-full justify-start gap-2 px-4 font-semibold",
					active && "bg-accent",
				)}
			>
				{icon ? icon : null}
				{label}
				{children}
			</Button>
		</Link>
	);
};

export default SidebarButton;
