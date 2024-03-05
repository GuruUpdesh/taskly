"use client";

import React from "react";

import { AnimatePresence } from "framer-motion";

import { useAppStore } from "~/store/app";

import NotificationItem from "./notification-item";

const NotificationList = () => {
	const notifications = useAppStore((state) => state.notifications);

	return (
		<AnimatePresence initial={false}>
			{notifications.map((notification, i) => (
				<NotificationItem key={i} notification={notification} />
			))}
		</AnimatePresence>
	);
};

export default NotificationList;
