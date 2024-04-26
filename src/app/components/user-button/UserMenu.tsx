"use client";

import React from "react";

import { useClerk } from "@clerk/nextjs";
import {
	GearIcon,
	GitHubLogoIcon,
	PaperPlaneIcon,
	PinLeftIcon,
	PlusIcon,
	ReaderIcon,
} from "@radix-ui/react-icons";
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
import { useNavigationStore } from "~/store/navigation";

type Props = {
	children: React.ReactNode;
};

const UserMenu = ({ children }: Props) => {
	const { signOut } = useClerk();
	const router = useRouter();
	const project = useNavigationStore((state) => state.currentProject);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-56 bg-background/75 p-2 backdrop-blur-lg"
				onCloseAutoFocus={(e) => e.preventDefault()}
				align="start"
			>
				<DropdownMenuGroup>
					<Link href="/settings" target="_blank">
						<DropdownMenuItem>
							Settings
							<DropdownMenuShortcut>
								<GearIcon />
							</DropdownMenuShortcut>
						</DropdownMenuItem>
					</Link>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{project && (
						<Link
							href={`/settings/project/${project.id}/general#invite`}
							target="_blank"
						>
							<DropdownMenuItem>
								Invite to Project
								<DropdownMenuShortcut>
									<PaperPlaneIcon />
								</DropdownMenuShortcut>
							</DropdownMenuItem>
						</Link>
					)}
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
					onClick={() => signOut(() => router.push("/"))}
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
