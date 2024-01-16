import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsNavigationState {
	backUrl: string | null;
	updateBackUrl: (newBackURL: string) => void;
}

const useSettingsNavigationStore = create<SettingsNavigationState>()(
	persist(
		(set) => ({
			backUrl: null,
			updateBackUrl: (newBackURL) => set({ backUrl: newBackURL }),
		}),
		{
			name: "settings-navigation-storage",
		},
	),
);

export { useSettingsNavigationStore };
