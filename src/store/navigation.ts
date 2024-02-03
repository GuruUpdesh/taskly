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
		}),
		{
			name: "settings-navigation-storage",
		},
	),
);

export { useNavigationStore };
