import { create } from "zustand";
import { persist } from "zustand/middleware";

import { type NotificationWithTask } from "~/actions/notification-actions";
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
	notifications: NotificationWithTask[];
	updateNotifications: (notifications: NotificationWithTask[]) => void;
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
	totalPoints: Partial<Record<string, number>>;
	addPoints: (key: string, points: number) => void;
}

const useAppStore = create<AppState>()(
	persist(
		(set) => ({
			isFiltersOpen: false,
			toggleFilters: () =>
				set((state) => ({ isFiltersOpen: !state.isFiltersOpen })),
			assignees: [],
			updateAssignees: (assignees) => set({ assignees }),
			sprints: [],
			updateSprints: (sprints) => set({ sprints }),
			notifications: [],
			updateNotifications: (notifications) => set({ notifications }),
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
			totalPoints: {},
			addPoints: (key, points) =>
				set((state) => {
					const totalPoints = { ...state.totalPoints };
					totalPoints[key] = (totalPoints[key] ?? 0) + points;
					return { totalPoints };
				}),
		}),
		{
			name: "settings-navigation-storage",
		},
	),
);

export { useAppStore };
