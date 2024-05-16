import { create } from "zustand";
import { persist } from "zustand/middleware";

import { type TaskProperty } from "~/config/taskConfigType";

export type Filter = {
	property: TaskProperty | "";
	is: boolean;
	values: string[];
	locked?: boolean;
};

export type ViewMode = "backlog" | "board";

interface AppState {
	isFiltersOpen: boolean;
	toggleFilters: () => void;
	filters: Filter[];
	updateFilters: (filters: Filter[]) => void;
	addFilter: (filter: Filter) => void;
	deleteFilter: (filter: Filter) => void;
	updateFilter: (oldFilter: Filter, filter: Filter) => void;
	groupByBacklog: TaskProperty | null;
	setGroupByBacklog: (groupBy: TaskProperty | null) => void;
	groupByBoard: TaskProperty;
	setGroupByBoard: (groupBy: TaskProperty) => void;
	hoveredTaskId: number | null;
	setHoveredTaskId: (id: number | null) => void;
	hoveredNotificationId: number | null;
	setHoveredNotificationId: (id: number | null) => void;
	viewMode: ViewMode;
	setViewMode: (mode: ViewMode) => void;
}

const useAppStore = create<AppState>()(
	persist(
		(set) => ({
			isFiltersOpen: true,
			toggleFilters: () =>
				set((state) => ({ isFiltersOpen: !state.isFiltersOpen })),
			filters: [],
			updateFilters: (filters) => set({ filters }),
			addFilter: (filter) =>
				set((state) => ({ filters: [...state.filters, filter] })),
			deleteFilter: (filter) =>
				set((state) => ({
					filters: state.filters.filter((f) => f !== filter),
				})),
			updateFilter: (oldFilter, filter) =>
				set((state) => {
					const filters = [...state.filters];
					const index = filters.findIndex((f) => f === oldFilter);
					if (index !== -1) {
						filters[index] = filter;
					}

					return { filters };
				}),
			groupByBacklog: null,
			setGroupByBacklog: (groupBy) => set({ groupByBacklog: groupBy }),
			groupByBoard: "status",
			setGroupByBoard: (groupBy) => set({ groupByBoard: groupBy }),
			hoveredTaskId: null,
			setHoveredTaskId: (id: number | null) => set({ hoveredTaskId: id }),

			hoveredNotificationId: null,
			setHoveredNotificationId: (id) =>
				set({ hoveredNotificationId: id }),
			viewMode: "backlog",
			setViewMode: (mode) => set({ viewMode: mode }),
		}),
		{
			name: "settings-navigation-storage",
		},
	),
);

export { useAppStore };
