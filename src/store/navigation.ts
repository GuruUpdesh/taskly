import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsNavigationState {
	lastApplicationPathname: string | null;
	updateLastApplicationPathname: (newBackURL: string) => void;
}

const useNavigationStore = create<SettingsNavigationState>()(
	persist(
		(set) => ({
			lastApplicationPathname: null,
			updateLastApplicationPathname: (newApplicationPathname) =>
				set({ lastApplicationPathname: newApplicationPathname }),
		}),
		{
			name: "settings-navigation-storage",
		},
	),
);

export { useNavigationStore };
