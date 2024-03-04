"use client";

import React from "react";

import { useNavigationStore } from "~/store/navigation";

type Props = {
	children: React.ReactNode;
};

const VisibleOnCollapsedSidebar = ({ children }: Props) => {
	const isSideBarCollapsed = useNavigationStore(
		(state) => state.isSideBarCollapsed,
	);
	if (!isSideBarCollapsed) return null;
	return <>{children}</>;
};

export default VisibleOnCollapsedSidebar;
