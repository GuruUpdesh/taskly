"use client";

import { useClerk } from "@clerk/nextjs";
import {
	GearIcon,
	GitHubLogoIcon,
	Link1Icon,
	PaperPlaneIcon,
	PersonIcon,
	PinLeftIcon,
	PlusIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type Props = {
	children: React.ReactNode;
};

const UserMenu = ({ children }: Props) => {
	const { signOut } = useClerk();
	const router = useRouter();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-56 bg-accent/50 p-2 backdrop-blur-lg"
				onCloseAutoFocus={(e) => e.preventDefault()}
				align="start"
			>
				<DropdownMenuLabel className="flex items-center gap-1">
					<PersonIcon />
					My Account
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<Link href="/settings">
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
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							Invite users
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent className="bg-accent/50 p-2 backdrop-blur-lg">
								<DropdownMenuItem>
									Email
									<DropdownMenuShortcut>
										<PaperPlaneIcon />
									</DropdownMenuShortcut>
								</DropdownMenuItem>
								<DropdownMenuItem>
									Link
									<DropdownMenuShortcut>
										<Link1Icon />
									</DropdownMenuShortcut>
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuItem>
						New Project
						<DropdownMenuShortcut>
							<PlusIcon />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					GitHub
					<DropdownMenuShortcut>
						<GitHubLogoIcon />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
				<DropdownMenuItem>Documentation</DropdownMenuItem>
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
