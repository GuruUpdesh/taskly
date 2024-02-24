import {
	InfoCircledIcon,
	MarginIcon,
	PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { AlertTriangle } from "lucide-react";
import { AiOutlineTeam } from "react-icons/ai";
import { PiPersonSimpleRun } from "react-icons/pi";
import type { UserRole } from "~/server/db/schema";

export type SettingsConfig = {
	anchor: string;
	title: string;
	icon: JSX.Element;
	allowedRoles?: UserRole[];
	className?: string;
};

export const generalSettings: SettingsConfig[] = [
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
