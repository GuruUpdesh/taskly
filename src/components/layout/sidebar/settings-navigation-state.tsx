"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { useNavigationStore } from "~/store/navigation";

const SettingsNavigationState = () => {
	const updateLastApplicationPathname = useNavigationStore(
		(state) => state.updateLastApplicationPathname,
	);
	const pathname = usePathname();

	React.useEffect(() => {
		updateLastApplicationPathname(pathname);
		console.log("🚀 ~ React.useEffect ~ pathname:", pathname);
	}, [pathname]);

	return null;
};

export default SettingsNavigationState;
