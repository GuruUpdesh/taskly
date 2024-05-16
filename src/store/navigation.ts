import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsNavigationState {
	lastApplicationPathname: string | null;
	updateLastApplicationPathname: (newBackURL: string) => void;
	isSideBarCollapsed: boolean;
	setSideBarCollapsed: (value: boolean) => void;
	expandSideBar: () => void;
	setExpandSideBar: (callback: () => void) => void;
	settingsOptions: Record<string, boolean>;
	updateSettingOption: (
		key: keyof SettingsNavigationState["settingsOptions"],
		value: boolean,
	) => void;
}

const useNavigationStore = create<SettingsNavigationState>()(
	persist(
		(set) => ({
			lastApplicationPathname: null,
			updateLastApplicationPathname: (newApplicationPathname) =>
				set({ lastApplicationPathname: newApplicationPathname }),
			isSideBarCollapsed: false,
			setSideBarCollapsed: (val) =>
				set(() => ({ isSideBarCollapsed: val })),
			expandSideBar: () => {
				console.warn("expandSideBar is not implemented");
			},
			setExpandSideBar: (callback) =>
				set(() => ({ expandSideBar: callback })),
			settingsOptions: {
				"project-info": false,
				theme: false,
				invite: false,
				members: false,
				sprints: false,
				"danger-zone": false,
			},
			updateSettingOption: (key, value) =>
				set((state) => ({
					settingsOptions: { ...state.settingsOptions, [key]: value },
				})),
		}),
		{
			name: "settings-navigation-storage",
		},
	),
);

export { useNavigationStore };
