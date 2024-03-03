"use client";

import React from "react";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { VisualState, useKBar } from "kbar";

import SimpleTooltip from "~/components/general/simple-tooltip";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

const SidebarSearch = () => {
	const { query, visualState } = useKBar((state) => ({
		visualState: state.visualState,
	}));

	return (
		<>
			<SimpleTooltip label="Search / Actions" side="right">
				<div className="relative hidden @sidebar:block">
					<MagnifyingGlassIcon className="absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%] text-muted-foreground" />
					<Input
						placeholder="Search"
						className="h-9 bg-background/75 pl-8"
						onClick={query.toggle}
					/>
				</div>
			</SimpleTooltip>
			<SimpleTooltip label="Search / Actions" side="right">
				<Button
					variant="outline"
					size="icon"
					className={cn(
						"z-10 h-9 bg-background/75 text-muted-foreground @sidebar:hidden",
						{
							"bg-accent":
								visualState === VisualState.showing ||
								visualState === VisualState.animatingIn,
						},
					)}
					onClick={query.toggle}
				>
					<MagnifyingGlassIcon />
				</Button>
			</SimpleTooltip>
		</>
	);
};

export default SidebarSearch;
