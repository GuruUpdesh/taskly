import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project, Task } from "~/server/db/schema";

interface SettingsNavigationState {
	lastApplicationPathname: string | null;
	updateLastApplicationPathname: (newBackURL: string) => void;
	currentProject: Project | null;
	updateProject: (newProject: Project) => void;
	currentTask: Task | null;
	updateTask: (newTask: Task) => void;
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
			currentProject: null,
			updateProject: (newProject) => set({ currentProject: newProject }),
			currentTask: null,
			updateTask: (newTask) => set({ currentTask: newTask }),
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
