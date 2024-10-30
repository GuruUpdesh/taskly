"use client";

import React from "react";

import { ListChecks } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { useAppStore } from "~/store/app";

import SidebarButton from "./sidebar-button";

type Props = {
	projectId: string;
};

const TaskViews = ({ projectId }: Props) => {
	const [currentFilters, updateFilters] = useAppStore(
		useShallow((state) => [state.filters, state.updateFilters]),
	);
	return (
		<SidebarButton
			label="Tasks"
			icon={
				<div>
					<ListChecks className="h-5 w-5 min-w-5" />
				</div>
			}
			url={`/project/${projectId}/tasks`}
			callback={() => {
				const unlockedFilters = currentFilters.filter((f) => !f.locked);
				updateFilters(unlockedFilters);
			}}
		/>
	);
};

export default TaskViews;
