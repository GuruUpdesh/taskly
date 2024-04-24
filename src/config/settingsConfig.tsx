import {
	GitHubLogoIcon,
	InfoCircledIcon,
	MarginIcon,
	PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { AlertTriangle } from "lucide-react";
import { AiOutlineTeam } from "react-icons/ai";
import { PiPersonSimpleRun } from "react-icons/pi";

import type { UserRole } from "~/server/db/schema";

export type settingsConfig = {
	anchor: string;
	title: string;
	icon: JSX.Element;
	allowedRoles?: UserRole[];
	className?: string;
};

export const generalSettings: settingsConfig[] = [
	{
		anchor: "project-info",
		title: "Project Information",
		icon: <InfoCircledIcon />,
		allowedRoles: ["owner", "admin"],
	},
	{
		anchor: "appearance",
		title: "Appearance",
		icon: <MarginIcon />,
	},
	{
		anchor: "invite",
		title: "Invite",
		icon: <PaperPlaneIcon />,
	},
	{
		anchor: "members",
		title: "Members",
		icon: <AiOutlineTeam />,
		allowedRoles: ["owner", "admin"],
	},
	{
		anchor: "github",
		title: "GitHub",
		icon: <GitHubLogoIcon />,
		allowedRoles: ["owner"],
	},
	{
		anchor: "sprints",
		title: "Sprints",
		icon: <PiPersonSimpleRun />,
	},
	{
		anchor: "danger-zone",
		title: "Danger Zone",
		icon: <AlertTriangle />,
		className: "text-red-500",
	},
];
