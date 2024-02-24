import { create } from "zustand";
import { persist } from "zustand/middleware";
import { taskConfig } from "~/config/task-entity";
import { Sprint, User } from "~/server/db/schema";

export type Filter = {
	property: keyof typeof taskConfig | "";
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
}

const useAppStore = create<AppState>()(
	persist(
		(set) => ({
            isFiltersOpen: false,
            toggleFilters: () => set((state) => ({ isFiltersOpen: !state.isFiltersOpen })),
			assignees: [],
			updateAssignees: (assignees: User[]) => set({ assignees }),
			sprints: [],
			updateSprints: (sprints: Sprint[]) => set({ sprints }),
			filters: [],
			updateFilters: (filters: Filter[]) => set({ filters }),
			addFilter: (filter: Filter) => set((state) => ({ filters: [...state.filters, filter] })),
			deleteFilter: (filter: Filter) => set((state) => ({ filters: state.filters.filter((f) => f !== filter) })),
		}),
		{
			name: "settings-navigation-storage",
		},
	),
);

export { useAppStore };