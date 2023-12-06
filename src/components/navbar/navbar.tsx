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

type NavbarProps = {
	children: React.ReactNode;
};

const Navbar = ({ children }: NavbarProps) => {
	return (
		<nav className="fixed z-50 flex w-full justify-between p-4">
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
			<div>
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
