"use client";

import React from "react";

import { ListTodo } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { filteredTaskViews } from "~/config/filteredTaskViews";
import { useAppStore } from "~/store/app";

import NestedSidebarButton from "./NestedSidebarButton";
import SidebarButton from "./sidebar-button";

type Props = {
	projectId: string;
	username?: string | null;
};

const TaskViews = ({ projectId, username }: Props) => {
	const [currentFilters, updateFilters] = useAppStore(
		useShallow((state) => [state.filters, state.updateFilters]),
	);
	return (
		<>
			<SidebarButton
				label="Tasks"
				icon={<ListTodo className="h-4 w-4 min-w-4" />}
				url={`/project/${projectId}/tasks`}
				callback={() => {
					const unlockedFilters = currentFilters.filter(
						(f) => !f.locked,
					);
					updateFilters(unlockedFilters);
				}}
			/>
			<div className="flex flex-col items-center gradient-mask-r-90 @sidebar:ml-4 @sidebar:items-start @sidebar:border-l">
				{filteredTaskViews.map((view) => (
					<NestedSidebarButton
						key={view.label}
						label={view.label}
						icon={view.icon}
						filters={view.filters}
						url={`/project/${projectId}/tasks`}
						username={username}
					/>
				))}
			</div>
		</>
	);
};

export default TaskViews;
