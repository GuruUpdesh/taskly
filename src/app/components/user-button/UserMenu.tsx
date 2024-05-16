"use client";

import React from "react";

import { useClerk } from "@clerk/nextjs";
import {
	GitHubLogoIcon,
	PersonIcon,
	PinLeftIcon,
	PlusIcon,
	ReaderIcon,
} from "@radix-ui/react-icons";
import { Folder, LightbulbIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useRealtimeStore } from "~/store/realtime";

type Props = {
	children: React.ReactNode;
};

const UserMenu = ({ children }: Props) => {
	const { signOut } = useClerk();
	const router = useRouter();

	const [isLightMode, setIsLightMode] = React.useState(false);
	const handleLightModeClick = () => {
		setIsLightMode(!isLightMode);
		const html = document.querySelector("html");
		if (html) {
			html.classList.toggle("invert");
		}
	};

	const project = useRealtimeStore((state) => state.project);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-56 bg-background/75 p-2 backdrop-blur-lg"
				onCloseAutoFocus={(e) => e.preventDefault()}
				align="end"
			>
				<DropdownMenuGroup>
					<Link href="/settings" target="_blank">
						<DropdownMenuItem>
							Account
							<DropdownMenuShortcut>
								<PersonIcon />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
					</Link>
					<DropdownMenuItem onClick={handleLightModeClick}>
						{isLightMode ? "Dark" : "Light"} Mode{" "}
						{isLightMode ? "" : "(beta)"}
						<DropdownMenuShortcut>
							<LightbulbIcon className="h-4 w-4" />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<Link
						href={`/settings/project/${project?.id}/general`}
						target="_blank"
					>
						<DropdownMenuItem>
							Project Settings
							<DropdownMenuShortcut>
								<Folder className="h-4 w-4" />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
					</Link>
					<Link href="/create-project">
						<DropdownMenuItem>
							New Project
							<DropdownMenuShortcut>
								<PlusIcon />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
					</Link>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<Link
					href="https://github.com/GuruUpdesh/taskly"
					target="_blank"
				>
					<DropdownMenuItem>
						GitHub
						<DropdownMenuShortcut>
							<GitHubLogoIcon />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</Link>
				<Link href="https://docs.tasklypm.com" target="_blank">
					<DropdownMenuItem>
						Documentation
						<DropdownMenuShortcut>
							<ReaderIcon />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</Link>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => signOut(() => router.push("/sign-in"))}
				>
					Log out
					<DropdownMenuShortcut>
						<PinLeftIcon />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserMenu;
