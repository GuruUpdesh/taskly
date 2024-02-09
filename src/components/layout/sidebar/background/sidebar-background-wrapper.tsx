import React from "react";
import { kv } from "@vercel/kv";
const SidebarDynamicBackground = dynamic(
	() => import("./sidebar-dynamic-background"),
	{ ssr: false },
);
import SidebarBackground from "./sidebar-background";
import dynamic from "next/dynamic";

type Props = {
	projectId: string;
};

const SidebarBackgroundWrapper = async ({ projectId }: Props) => {
	const projectColor = await kv.get("project-color-" + projectId);

	if (projectColor) {
		return <SidebarBackground color={projectColor as string} />;
	} else {
		return <SidebarDynamicBackground />;
	}
};

export default SidebarBackgroundWrapper;
