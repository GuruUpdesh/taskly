"use client";

import React from "react";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import { Button } from "~/components/ui/button";
import { useCmdStore } from "~/store/cmd";

const SidebarSearch = () => {
	const setOpen = useCmdStore((state) => state.setMenuOpen);
	return (
		<Button
			variant="outline"
			className="relative h-9 w-full justify-between rounded-xl rounded-r-md bg-foreground/10 pl-10 font-normal text-muted-foreground"
			onClick={() => setOpen(true)}
		>
			<MagnifyingGlassIcon className="absolute left-3 top-[50%] h-4 w-4 translate-y-[-50%] " />
			Search
			<span className="flex whitespace-nowrap rounded bg-border px-1 text-xs">
				⌘ + k
			</span>
		</Button>
	);
};

export default SidebarSearch;
