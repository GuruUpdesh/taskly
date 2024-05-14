import { create } from "zustand";
import { persist } from "zustand/middleware";

import { type NotificationWithTask } from "~/actions/notification-actions";
import {
	type Project,
	type Task,
	type Sprint,
	type User,
} from "~/server/db/schema";

interface RealtimeState {
	project: Project | null;
	updateProject: (project: Project) => void;
	assignees: User[];
	updateAssignees: (assignees: User[]) => void;
	sprints: Sprint[];
	updateSprints: (sprints: Sprint[]) => void;
	task: Task | null;
	updateTask: (task: Task) => void;
	notifications: NotificationWithTask[];
	updateNotifications: (notifications: NotificationWithTask[]) => void;
}

export const useRealtimeStore = create<RealtimeState>()(
	persist(
		(set) => ({
			project: null,
			updateProject: (project) => set({ project }),
			assignees: [],
			updateAssignees: (assignees) => set({ assignees }),
			sprints: [],
			updateSprints: (sprints) => set({ sprints }),
			task: null,
			updateTask: (task) => set({ task }),
			notifications: [],
			updateNotifications: (notifications) => set({ notifications }),
		}),
		{
			name: "realtime-storage",
		},
	),
);
