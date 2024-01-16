"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { useSettingsNavigationStore } from "~/store/settingsNavigation";

type Props = {
	children: React.ReactNode;
};

const SettingsNavigationState = ({ children }: Props) => {
	const updateBackUrl = useSettingsNavigationStore(
		(state) => state.updateBackUrl,
	);
	const pathname = usePathname();

	React.useEffect(() => {
		updateBackUrl(pathname);
		console.log("🚀 ~ React.useEffect ~ pathname:", pathname);
	}, [pathname]);

	return children;
};

export default SettingsNavigationState;
