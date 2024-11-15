"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useShallow } from "zustand/react/shallow";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { type Sprint } from "~/schema";
import { useAppStore, type Filter } from "~/store/app";
import { useRealtimeStore } from "~/store/realtime";

export type SidebarButtonProps = {
	label: string;
	filters?: (sprints?: Sprint[], username?: string | null) => Filter[];
	username?: string | null;
};

const FilterViewsToggleButton = ({
	label,
	filters,
	username,
}: SidebarButtonProps) => {
	const [currentFilters, updateFilters] = useAppStore(
		useShallow((state) => [state.filters, state.updateFilters]),
	);
	const sprints = useRealtimeStore((state) => state.sprints);
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		if (!filters) return;

		const getFilters = filters(sprints, username);
		if (getFilters.length === 0) setHidden(true);
		else setHidden(false);
	}, [filters, sprints]);

	const active = useMemo(() => {
		if (!filters) {
			return false;
		}
		const getFilters = filters(sprints, username);
		const lockedFilters = currentFilters.filter((f) => f.locked);
		return JSON.stringify(getFilters) === JSON.stringify(lockedFilters);
	}, [currentFilters, filters, sprints]);

	const handleClick = useCallback(() => {
		if (active || !filters) {
			const unlockedFilters = currentFilters.filter((f) => !f.locked);
			updateFilters(unlockedFilters);
		} else if (filters) {
			const getFilters = filters(sprints, username);
			const unlockedFilters = currentFilters.filter((f) => !f.locked);
			updateFilters([...getFilters, ...unlockedFilters]);
		}
	}, [sprints, username, active]);

	if (hidden) return null;

	return (
		<Button
			className={cn("rounded-none border-r last:border-none", {
				"bg-accent": active,
			})}
			variant="ghost"
			size="sm"
			onClick={handleClick}
		>
			{label}
		</Button>
	);
};

export default FilterViewsToggleButton;
