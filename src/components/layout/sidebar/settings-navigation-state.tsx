"use client";

import React from "react";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { updateUserApplicationData } from "~/actions/application/redis-actions";
import { useNavigationStore } from "~/store/navigation";

const SettingsNavigationState = () => {
	const updateLastApplicationPathname = useNavigationStore(
		(state) => state.updateLastApplicationPathname,
	);
	const pathname = usePathname();
	const { user } = useUser();

	React.useEffect(() => {
		void updateUserApplicationData(pathname);
	}, [user, pathname]);

	React.useEffect(() => {
		updateLastApplicationPathname(pathname);
	}, [pathname]);

	return null;
};

export default SettingsNavigationState;
