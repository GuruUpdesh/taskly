"use client";

import React from "react";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import SimpleTooltip from "~/components/SimpleTooltip";
import { Button } from "~/components/ui/button";
import { useCmdStore } from "~/store/cmd";

const SidebarSearch = () => {
	const setOpen = useCmdStore((state) => state.setMenuOpen);
	return (
		<>
			<SimpleTooltip label="Search / Commands" side="right">
				<div className="relative hidden w-full @sidebar:block">
					<MagnifyingGlassIcon className="absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%] text-muted-foreground" />
					<Button
						variant="outline"
						className="h-9 w-full justify-between bg-foreground/5 pl-8"
						onClick={() => setOpen(true)}
					>
						Search
						<span className="flex whitespace-nowrap rounded bg-border px-1 text-xs">
							⌘ + k
						</span>
					</Button>
				</div>
			</SimpleTooltip>
		</>
	);
};

export default SidebarSearch;
