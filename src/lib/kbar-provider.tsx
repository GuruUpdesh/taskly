"use client";

import {
	DashboardIcon,
	EnvelopeClosedIcon,
	GearIcon,
	HomeIcon,
} from "@radix-ui/react-icons";
import { KBarProvider as KBarProviderImpl } from "kbar";
import { ListTodo } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useRealtimeStore } from "~/store/realtime";

type Props = {
	children: React.ReactNode;
};

export default function KBarProvider({ children }: Props) {
	const router = useRouter();
	const project = useRealtimeStore((state) => state.project);

	function projectNavigation(route: string) {
		if (!project) {
			toast.error("No project selected");
			return;
		}

		const updatedRoute = route.replace("<id>", String(project.id));
		router.push(`${updatedRoute}`);
	}

	const initialActions = [
		{
			id: "home",
			name: "Home",
			icon: <HomeIcon />,
			shortcut: ["g", "h"],
			perform: () => router.push("/"),
			section: "Navigation",
		},
		{
			id: "dashboard",
			name: "Dashboard",
			icon: <DashboardIcon />,
			shortcut: ["g", "d"],
			perform: () => projectNavigation("/project/<id>"),
			section: "Navigation",
		},
		{
			id: "inbox",
			name: "Inbox",
			icon: <EnvelopeClosedIcon />,
			shortcut: ["g", "i"],
			perform: () => projectNavigation("/project/<id>/inbox"),
			section: "Navigation",
		},
		{
			id: "tasks",
			name: "Tasks",
			icon: <ListTodo className="h-4 w-4" />,
			shortcut: ["g", "l"],
			perform: () => projectNavigation("/project/<id>/tasks"),
			section: "Navigation",
		},
		{
			id: "settings",
			name: "Settings",
			icon: <GearIcon />,
			shortcut: ["g", "s"],
			perform: () => projectNavigation("/settings/project/<id>/general"),
			section: "Navigation",
		},
	];

	return (
		<KBarProviderImpl actions={initialActions}>{children}</KBarProviderImpl>
	);
}
