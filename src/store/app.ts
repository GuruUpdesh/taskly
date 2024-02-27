import { create } from "zustand";
import { persist } from "zustand/middleware";

import { type TaskProperty } from "~/config/TaskConfigType";
import { type Sprint, type User } from "~/server/db/schema";

export type Filter = {
	property: TaskProperty | "";
	is: boolean;
	values: string[];
};

interface AppState {
	isFiltersOpen: boolean;
	toggleFilters: () => void;
	assignees: User[];
	updateAssignees: (assignees: User[]) => void;
	sprints: Sprint[];
	updateSprints: (sprints: Sprint[]) => void;
	filters: Filter[];
	updateFilters: (filters: Filter[]) => void;
	addFilter: (filter: Filter) => void;
	deleteFilter: (filter: Filter) => void;
	updateFilter: (oldFilter: Filter, filter: Filter) => void;
	groupBy: TaskProperty | null;
	setGroupBy: (groupBy: TaskProperty | null) => void;
	hoveredTaskId: number | null;
	setHoveredTaskId: (id: number | null) => void;
}

const useAppStore = create<AppState>()(
	persist(
		(set) => ({
			isFiltersOpen: false,
			toggleFilters: () =>
				set((state) => ({ isFiltersOpen: !state.isFiltersOpen })),
			assignees: [],
			updateAssignees: (assignees: User[]) => set({ assignees }),
			sprints: [],
			updateSprints: (sprints: Sprint[]) => set({ sprints }),
			filters: [],
			updateFilters: (filters: Filter[]) => set({ filters }),
			addFilter: (filter: Filter) =>
				set((state) => ({ filters: [...state.filters, filter] })),
			deleteFilter: (filter: Filter) =>
				set((state) => ({
					filters: state.filters.filter((f) => f !== filter),
				})),
			updateFilter: (oldFilter: Filter, filter: Filter) =>
				set((state) => {
					const filters = [...state.filters];
					const index = filters.findIndex((f) => f === oldFilter);
					if (index !== -1) {
						filters[index] = filter;
					}

					return { filters };
				}),
			groupBy: null,
			setGroupBy: (groupBy: TaskProperty | null) => set({ groupBy }),
			hoveredTaskId: null,
			setHoveredTaskId: (id: number | null) => set({ hoveredTaskId: id }),
		}),
		{
			name: "settings-navigation-storage",
		},
	),
);

export { useAppStore };
