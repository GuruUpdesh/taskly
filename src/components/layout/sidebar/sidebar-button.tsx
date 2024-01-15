"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

type Props = {
	label: string;
	icon: React.ReactNode;
	url: string;
	children?: React.ReactNode;
};

const SidebarButton = ({ label, icon, url, children }: Props) => {
	const pathname = usePathname();
	const active = useMemo(() => pathname === url, [pathname, url]);
	return (
		<Link href={url}>
			<Button
				variant="ghost"
				size="sm"
				className={cn(
					"w-full justify-start gap-2 px-4 font-semibold",
					active && "bg-accent",
				)}
			>
				{icon}
				{label}
				{children}
			</Button>
		</Link>
	);
};

export default SidebarButton;
