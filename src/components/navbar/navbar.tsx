"use client";

import React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { Button } from "../ui/button";
import Image from "next/image";
import { ModeToggle } from "../themes-switcher";

type NavbarProps = {
	children: React.ReactNode;
};

const Navbar = ({ children }: NavbarProps) => {
	return (
		<nav className="fixed z-50 flex w-full justify-between bg-black/50 p-4 py-2 backdrop-blur-lg">
			<div>
				<Image
					src="/static/taskly-logo.png"
					alt="logo"
					height="38"
					width="100"
				/>
			</div>
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuLink
							className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
							href="/"
						>
							Home
						</NavigationMenuLink>
					</NavigationMenuItem>
					{children}
					<NavigationMenuItem className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
						<NavigationMenuLink href="/email">
							Email
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
						<NavigationMenuLink href="/tasks">
							Tasks
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
			<div className="flex items-center space-x-2">
				<ModeToggle />
				<SignedIn>
					<UserButton afterSignOutUrl="/" />
				</SignedIn>
				<SignedOut>
					<Link href="/tasks">
						<Button>Login</Button>
					</Link>
				</SignedOut>
			</div>
		</nav>
	);
};

export default Navbar;