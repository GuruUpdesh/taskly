"use client";

import React from "react";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import {
	ClipboardCopy,
	GitBranch,
	Link,
	SparkleIcon,
	Trash,
} from "lucide-react";
import { toast } from "sonner";

import Commands from "~/features/cmd-menu/Commands";
import "~/features/cmd-menu/cmdstyles.css";
import { type Cmd } from "~/store/cmd";

const commands: Cmd[] = [
	{
		id: 0 + "copy-branch-name",
		label: "Copy Branch Name",
		icon: <GitBranch className="h-4 w-4" />,
		priority: 3,
		action: () => {
			toast.info("Copied branch name to clipboard", {
				icon: <GitHubLogoIcon className="h-4 w-4" />,
			});
		},
		shortcut: [],
	},
	{
		id: 0 + "copy-link",
		label: "Copy Link",
		icon: <Link className="h-4 w-4" />,
		priority: 2,
		action: () => {
			toast.info("Task link copied to clipboard", {
				icon: <ClipboardCopy className="h-4 w-4" />,
			});
		},
		shortcut: [],
	},
	{
		id: 0 + "delete",
		label: "Delete",
		icon: <Trash className="h-4 w-4" />,
		priority: 1,
		action: () => {
			toast.error("Task deleted", {
				icon: <Trash className="h-4 w-4" />,
			});
		},
		shortcut: [],
	},
	{
		id: 0 + "smart-properties",
		label: "Apply Smart Properties",
		icon: <SparkleIcon className="h-4 w-4" />,
		priority: 4,
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		action: () => {},
		shortcut: [],
	},
];
const GlobalSearch = () => {
	return (
		<div className="pl-4">
			<div className="overflow-hidden rounded-tl-lg bg-indigo-800/35">
				<div className="z-10 mix-blend-screen">
					<Commands commands={commands} />
				</div>
			</div>
		</div>
	);
};

export default GlobalSearch;
