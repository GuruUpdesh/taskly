import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
    isFiltersOpen: boolean;
    toggleFilters: () => void;
}

const useAppStore = create<AppState>()(
	persist(
		(set) => ({
            isFiltersOpen: false,
            toggleFilters: () => set((state) => ({ isFiltersOpen: !state.isFiltersOpen })),
		}),
		{
			name: "settings-navigation-storage",
		},
	),
);

export { useAppStore };