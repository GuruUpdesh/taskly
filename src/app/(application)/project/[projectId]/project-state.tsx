"use client";

import { useEffect } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BellIcon } from "lucide-react";
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
import constructToastURL from "~/lib/toast/global-toast-url-constructor";
import { useAppStore } from "~/store/app";
import { useNavigationStore } from "~/store/navigation";

type Props = {
	projectId: string;
	userId: string;
};

const ProjectState = ({ projectId, userId }: Props) => {
	const updateProject = useNavigationStore((state) => state.updateProject);
	const [updateAssignees, updateSprints, updateNotifications] = useAppStore(
		useShallow((state) => [
			state.updateAssignees,
			state.updateSprints,
			state.updateNotifications,
		]),
	);

	const projectResult = useQuery({
		queryKey: ["project", projectId],
		queryFn: () => getProject(Number(projectId)),
		staleTime: 2 * 1000,
		refetchInterval: 20 * 1000,
	});

	const assigneeSprintResult = useQuery({
		queryKey: ["assignees/sprints", projectId],
		queryFn: async () => {
			const assignees = await getAssigneesForProject(parseInt(projectId));
			const sprints = await getSprintsForProject(parseInt(projectId));
			console.log("assignees", assignees);

			return { assignees, sprints };
		},
		staleTime: 2 * 1000,
		refetchInterval: 10 * 1000,
	});

	const queryClient = useQueryClient();

	async function refetchNotifications() {
		const data = await getAllNotifications(userId);
		let newNotifications = data;
		if (newNotifications) {
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
		}
		return newNotifications;
	}

	const notificationResults = useQuery({
		queryKey: ["notifications", projectId],
		queryFn: () => refetchNotifications(),
		staleTime: 2 * 1000,
		refetchInterval: 10 * 1000,
	});

	const router = useRouter();

	useEffect(() => {
		const result = projectResult.data;
		if (!result?.success || !result.project) {
			if (result?.message) {
				router.push(constructToastURL(result.message, "error"));
			}
			router.push(constructToastURL("Error loading project", "error"));
			return;
		}
		const project = result?.project;
		if (project) {
			updateProject(project);
			void updateProjectApplicationData(project);
		}
	}, [projectResult.data]);

	useEffect(() => {
		if (assigneeSprintResult.data?.assignees) {
			console.log(
				"assigneeSprintResult.data?.assignees",
				assigneeSprintResult.data?.assignees,
			);
			updateAssignees(assigneeSprintResult.data.assignees);
		}
	}, [assigneeSprintResult.data?.assignees]);

	useEffect(() => {
		if (assigneeSprintResult.data?.sprints) {
			console.log(
				"assigneeSprintResult.data?.sprints",
				assigneeSprintResult.data?.sprints,
			);
			updateSprints(assigneeSprintResult.data?.sprints);
		}
	}, [assigneeSprintResult.data?.sprints]);

	useEffect(() => {
		if (notificationResults.data) {
			updateNotifications(notificationResults.data);
		}
	}, [notificationResults.data]);

	return null;
};

export default ProjectState;
