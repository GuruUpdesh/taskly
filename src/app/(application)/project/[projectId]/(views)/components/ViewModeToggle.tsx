"use client";

import React from "react";

import { Columns3, Rows3 } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import SimpleTooltip from "~/app/components/SimpleTooltip";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useAppStore } from "~/store/app";

const ViewModeToggle = () => {
	const [viewMode, setViewMode] = useAppStore(
		useShallow((state) => [state.viewMode, state.setViewMode]),
	);
	return (
		<div className="flex overflow-hidden rounded border">
			<SimpleTooltip label="Backlog">
				<Button
					variant="outline"
					size="sm"
					className={cn(
						"flex items-center gap-1 rounded-none border-b-0 border-l-0 border-r border-t-0 bg-transparent px-3 @3xl:px-4",
						{
							"bg-accent hover:bg-accent/75":
								viewMode === "backlog",
							"text-muted-foreground": viewMode !== "backlog",
						},
					)}
					onClick={() => setViewMode("backlog")}
				>
					<Rows3 className="h-4 w-4" />
				</Button>
			</SimpleTooltip>
			<SimpleTooltip label="Board">
				<Button
					variant="outline"
					size="sm"
					className={cn(
						"flex items-center gap-1 rounded-none border-b-0 border-l-0 border-r border-t-0 bg-transparent px-3 @3xl:px-4",
						{
							"bg-accent hover:bg-accent/75":
								viewMode === "board",
							"text-muted-foreground": viewMode !== "board",
						},
					)}
					onClick={() => setViewMode("board")}
				>
					<Columns3 className="h-4 w-4" />
				</Button>
			</SimpleTooltip>
		</div>
	);
};

export default ViewModeToggle;
