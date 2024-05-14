"use client";

import { useEffect } from "react";

import {
	DashboardIcon,
	EnvelopeClosedIcon,
	GearIcon,
} from "@radix-ui/react-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRegisterActions } from "kbar";
import { BellIcon, ListTodo } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import {
	getAssigneesForProject,
	getProject,
} from "~/actions/application/project-actions";
import { updateProjectApplicationData } from "~/actions/application/redis-actions";
import { getSprintsForProject } from "~/actions/application/sprint-actions";
import {
	type NotificationWithTask,
	getAllNotifications,
} from "~/actions/notification-actions";
import { getRefetchIntervals } from "~/config/refetchIntervals";
import constructToastURL from "~/lib/toast/global-toast-url-constructor";
import { useRealtimeStore } from "~/store/realtime";
import { useUserStore } from "~/store/user";

type Props = {
	projectId: number;
	userId: string;
	aiUsageCount: number;
};

const ProjectState = ({ projectId, userId, aiUsageCount }: Props) => {
	const [updateProject, updateAssignees, updateSprints, updateNotifications] =
		useRealtimeStore(
			useShallow((state) => [
				state.updateProject,
				state.updateAssignees,
				state.updateSprints,
				state.updateNotifications,
			]),
		);

	const [setUserId, setAiUsageCount] = useUserStore(
		useShallow((state) => [state.setUserId, state.setAiUsageCount]),
	);

	const projectResult = useQuery({
		queryKey: ["project", projectId],
		queryFn: () => getProject(projectId, userId),
		staleTime: 2 * 1000,
		refetchInterval: getRefetchIntervals().projects,
	});

	const assigneeSprintResult = useQuery({
		queryKey: ["assignees/sprints", projectId],
		queryFn: async () => {
			const assignees = await getAssigneesForProject(projectId);
			const sprints = await getSprintsForProject(projectId);

			return { assignees, sprints };
		},
		staleTime: 2 * 1000,
		refetchInterval: getRefetchIntervals().assignees,
	});

	const queryClient = useQueryClient();

	async function refetchNotifications() {
		const result = await getAllNotifications(userId);
		if (result.error !== null) {
			console.error(result.error);
			return;
		}
		let newNotifications = result.data;

		const previousNotifications = queryClient.getQueryData<
			NotificationWithTask[]
		>(["notifications", projectId]);

		newNotifications = newNotifications.map((notification) => {
			const isExistingNotification = previousNotifications?.find(
				(prevNotif) => prevNotif.id === notification.id,
			);
			if (!isExistingNotification) {
				toast(`New notification`, {
					description: notification.message,
					icon: <BellIcon className="h-4 w-4" />,
					cancel: {
						label: "Dismiss",
						onClick: () => {
							console.log("dismissed");
						},
					},
					cancelButtonStyle: {
						backgroundColor: "transparent",
						color: "hsl(var(--foreground))",
					},
					duration: 5000,
				});
				return { ...notification, options: { isNew: true } };
			}
			return notification;
		});

		return newNotifications;
	}

	const notificationResults = useQuery({
		queryKey: ["notifications", projectId],
		queryFn: () => refetchNotifications(),
		staleTime: 2 * 1000,
		refetchInterval: getRefetchIntervals().notifications,
	});

	const router = useRouter();

	useEffect(() => {
		const result = projectResult.data;
		if (!result || result.error !== null) {
			if (result?.error) {
				router.push(constructToastURL(result.error, "error"));
				return;
			}
			router.push(
				constructToastURL("Project results are undefined", "error"),
			);
			return;
		}
		const project = result.data;
		updateProject(project);
		void updateProjectApplicationData(project);
	}, [projectResult.data]);

	useEffect(() => {
		const result = assigneeSprintResult.data?.assignees;
		if (!result || result.error !== null) {
			if (result?.error) {
				router.push(constructToastURL(result.error, "error"));
				return;
			}
			router.push(
				constructToastURL(
					"Assignee and sprint results are undefined",
					"error",
				),
			);
			return;
		}
		updateAssignees(result.data);
	}, [assigneeSprintResult.data?.assignees]);

	useEffect(() => {
		if (assigneeSprintResult.data?.sprints) {
			updateSprints(assigneeSprintResult.data?.sprints);
		}
	}, [assigneeSprintResult.data?.sprints]);

	useEffect(() => {
		const results = notificationResults.data;
		if (results) {
			updateNotifications(results);
		}
	}, [notificationResults.data]);

	useEffect(() => {
		setUserId(userId);
	}, [userId]);

	useEffect(() => {
		setAiUsageCount(aiUsageCount);
	}, [aiUsageCount]);

	const actions = [
		{
			id: "dashboard",
			name: "Dashboard",
			icon: <DashboardIcon />,
			shortcut: ["g", "d"],
			perform: () => router.push(`/project/${projectId}`),
			section: "Navigation",
		},
		{
			id: "inbox",
			name: "Inbox",
			icon: <EnvelopeClosedIcon />,
			shortcut: ["g", "i"],
			perform: () => router.push(`/project/${projectId}/inbox`),
			section: "Navigation",
		},
		{
			id: "tasks",
			name: "Tasks",
			icon: <ListTodo className="h-4 w-4" />,
			shortcut: ["g", "l"],
			perform: () => router.push(`/project/${projectId}/tasks`),
			section: "Navigation",
		},
		{
			id: "settings",
			name: "Settings",
			icon: <GearIcon />,
			shortcut: ["g", "s"],
			perform: () =>
				router.push(`/settings/project/${projectId}/general`),
			section: "Navigation",
		},
	];

	useRegisterActions(actions, [projectId]);

	return null;
};

export default ProjectState;
