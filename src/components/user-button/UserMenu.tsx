"use client";

import React from "react";

import { useClerk } from "@clerk/nextjs";
import { PersonIcon, PinLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuShortcut,
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
				className="w-56 p-2"
				onCloseAutoFocus={(e) => e.preventDefault()}
				align="end"
			>
				<Link href="/settings" target="_blank">
					<DropdownMenuItem>
						Account
						<DropdownMenuShortcut>
							<PersonIcon />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</Link>
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
