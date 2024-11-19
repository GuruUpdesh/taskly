import { create } from "zustand";
import { persist } from "zustand/middleware";

import { type TaskFormType } from "~/features/tasks/components/CreateTask";
import { type TaskProperty } from "~/features/tasks/config/taskConfigType";

export type Filter = {
	property: TaskProperty | "";
	is: boolean;
	values: string[];
	locked?: boolean;
};

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
	hoveredTaskId: number | null;
	setHoveredTaskId: (id: number | null) => void;
	hoveredNotificationId: number | null;
	setHoveredNotificationId: (id: number | null) => void;
	taskFormState: Partial<TaskFormType> | null;
	setTaskFormState: (state: Partial<TaskFormType> | null) => void;
	clearTaskFormState: () => void;
}

const useAppStore = create<AppState>()(
	persist(
		(set) => ({
			isFiltersOpen: true,
			toggleFilters: () =>
				set((state) => {
					const cookieValue = `filters:state=${!state.isFiltersOpen ? "true" : "false"}`;
					document.cookie = `${cookieValue}; SameSite=Lax`;
					return { isFiltersOpen: !state.isFiltersOpen };
				}),

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

			hoveredTaskId: null,
			setHoveredTaskId: (id: number | null) => set({ hoveredTaskId: id }),

			hoveredNotificationId: null,
			setHoveredNotificationId: (id) =>
				set({ hoveredNotificationId: id }),

			taskFormState: null,
			setTaskFormState: (state) => set({ taskFormState: state }),
			clearTaskFormState: () =>
				set((state) => ({
					...state,
					taskFormState: null,
				})),
		}),
		{
			name: "app-storage",
		},
	),
);

export { useAppStore };
