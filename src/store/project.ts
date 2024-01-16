import { create } from "zustand";
import type { Project } from "~/server/db/schema";
import { persist } from "zustand/middleware";

interface ProjectState {
	project: Project | null;
	updateProject: (newProject: Project) => void;
}

const useProjectStore = create<ProjectState>()(
	persist(
		(set) => ({
			project: null,
			updateProject: (newProject) => set({ project: newProject }),
		}),
		{
			name: "project-storage",
		},
	),
);

export { useProjectStore };
