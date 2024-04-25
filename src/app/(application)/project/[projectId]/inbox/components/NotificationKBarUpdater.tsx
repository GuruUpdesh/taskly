import { useRegisterActions, type Action } from "kbar";

import { useAppStore } from "~/store/app";

type Props = {
	actions: (Action | null)[];
	notificationId: number;
};

const NotificationKBarUpdater = ({ actions, notificationId }: Props) => {
	const hoveredNotificationId = useAppStore(
		(state) => state.hoveredNotificationId,
	);
	useRegisterActions(
		hoveredNotificationId === notificationId
			? actions.filter((a): a is Action => a !== null)
			: [],
		[notificationId, actions, hoveredNotificationId],
	);
	return null;
};

export default NotificationKBarUpdater;
