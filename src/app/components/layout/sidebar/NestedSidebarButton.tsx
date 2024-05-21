"use client";

import React, { useEffect, useMemo, useState } from "react";

import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useShallow } from "zustand/react/shallow";

import SimpleTooltip from "~/app/components/SimpleTooltip";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { type Sprint } from "~/server/db/schema";
import { useAppStore, type Filter } from "~/store/app";
import { useRealtimeStore } from "~/store/realtime";

export type SidebarButtonProps = {
	label: string;
	url: string | string[];
	filters: (sprints?: Sprint[], username?: string | null) => Filter[];
	icon?: React.ReactNode;
	username?: string | null;
};

const NestedSidebarButton = ({
	label,
	icon,
	filters,
	url,
	username,
}: SidebarButtonProps) => {
	const [currentFilters, updateFilters] = useAppStore(
		useShallow((state) => [state.filters, state.updateFilters]),
	);
	const sprints = useRealtimeStore((state) => state.sprints);
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		const getFilters = filters(sprints, username);
		if (getFilters.length === 0) setHidden(true);
		else setHidden(false);
	}, [filters, sprints]);

	const active = useMemo(() => {
		const getFilters = filters(sprints, username);
		const lockedFilters = currentFilters.filter((f) => f.locked);
		return JSON.stringify(getFilters) === JSON.stringify(lockedFilters);
	}, [currentFilters, filters, sprints]);

	function handleClick() {
		const getFilters = filters(sprints, username);
		const unlockedFilters = currentFilters.filter((f) => !f.locked);
		updateFilters([...getFilters, ...unlockedFilters]);
	}

	if (hidden) return null;

	return (
		<SimpleTooltip label={label + " View"} side="right">
			<Link
				href={Array.isArray(url) ? url[0]! : url}
				className={cn("w-full flex-1 @sidebar:block")}
			>
				<Button
					variant="ghost"
					size="sm"
					className={cn(
						"group relative w-full justify-center gap-2 !bg-transparent p-0 font-semibold opacity-75 @sidebar:justify-start @sidebar:px-4",
						active && "opacity-100",
					)}
					onClick={handleClick}
				>
					{icon ? icon : null}
					<span className="hidden flex-1 whitespace-nowrap @sidebar:inline-flex">
						{label}
					</span>
					<div className="absolute right-2 bg-gradient-to-r from-transparent to-background to-25% p-1 pl-0 pr-2 opacity-0 transition-all  group-hover:right-0  group-hover:opacity-100">
						<ArrowRightIcon className="h-4 w-4 transition-all" />
					</div>
				</Button>
			</Link>
		</SimpleTooltip>
	);
};

export default NestedSidebarButton;
