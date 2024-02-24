"use client";

import React from "react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "~/components/ui/navigation-menu";

type NavbarProps = {
	children: React.ReactNode;
};

const Navbar = ({ children }: NavbarProps) => {
	return (
		<nav className="flex justify-between">
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
					<NavigationMenuItem>
						<NavigationMenuLink
							className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
							href="/"
						>
							Documentation
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</nav>
	);
};

export default Navbar;
