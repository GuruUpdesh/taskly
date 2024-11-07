"use client";

import React from "react";

import {
	NavigationMenu,
	NavigationMenuList,
} from "~/components/ui/navigation-menu";

type NavbarProps = {
	children: React.ReactNode;
};

const NavbarMenu = ({ children }: NavbarProps) => {
	return (
		<NavigationMenu className="hidden justify-between md:flex">
			<NavigationMenuList>{children}</NavigationMenuList>
		</NavigationMenu>
	);
};

export default NavbarMenu;
