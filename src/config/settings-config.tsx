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
	description: string;
	icon: JSX.Element;
	allowedRoles?: UserRole[];
	className?: string;
};

export const generalSettings: SettingsConfig[] = [
	{
		anchor: "project-info",
		title: "Project Information",
		icon: <InfoCircledIcon />,
		description:
			"General information about the project, make sure to save any changes.",
		allowedRoles: ["owner", "admin"],
	},
	{
		anchor: "theme",
		title: "Theme",
		icon: <MarginIcon />,
		description: "Update the way your project looks and feels.",
	},
	{
		anchor: "invite",
		title: "Invite",
		icon: <PaperPlaneIcon />,
		description: "Invite members to the project.",
	},
	{
		anchor: "members",
		title: "Members",
		icon: <AiOutlineTeam />,
		description: "Manage the members of the project.",
		allowedRoles: ["owner", "admin"],
	},
	{
		anchor: "sprints",
		title: "Sprints",
		icon: <PiPersonSimpleRun />,
		description:
			"Sprints will be created automatically when your current sprint ends, or you can create one manually. Sprints are used to manage your project's workload and are a great way to keep your team on track.",
	},
	{
		anchor: "danger-zone",
		title: "Danger Zone",
		icon: <AlertTriangle />,
		description: "Be careful with these settings, they can't be undone.",
		className: "text-red-500",
	},
];
