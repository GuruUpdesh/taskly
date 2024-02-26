"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

const properties = [
	"status",
	"priority",
	"type",
	"assignee",
	"sprintId",
] as const;

import React, { useMemo } from "react";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import { Group, Minus, MinusIcon } from "lucide-react";
import { getTaskConfig } from "~/config/task-entity";
import { useAppStore } from "~/store/app";
import { type TaskConfig } from "~/config/entityTypes";

const GroupButton = () => {
    const [open, setOpen] = React.useState(false);
    const [groupBy, setGroupBy] = useAppStore((state) => [state.groupBy, state.setGroupBy]);

    const config = useMemo(() => {
        if (!groupBy) return null;
        return getTaskConfig(groupBy as keyof TaskConfig);
    }, [groupBy])

    function handleGroupChange(value: string) {
        if (value === "none") {
            setGroupBy(null)
        } else {
            setGroupBy(value)
        }
    }

	return (
		<Select open={open} onOpenChange={(open) => setOpen(open)} defaultValue="none" value={groupBy ? groupBy : "none"} onValueChange={(val) => handleGroupChange(val)}>
			<SelectTrigger asChild className="!ring-0 h-min border-b-0 border-l border-r-0 border-t-0 ">
				<Button
					variant="outline"
					size="sm"
					className={cn(
						"flex items-center gap-1 rounded-none border-none px-4 text-muted-foreground",
                        {
                            "bg-accent text-white": open,
                            "bg-accent hover:bg-accent/75 text-white": groupBy,
                        }
					)}
				>
					<Group className="h-4 w-4" />
                    {groupBy ? `Grouping by ${config?.displayName}` : "Group"}
				</Button>
			</SelectTrigger>
			<SelectContent>
                <SelectItem
							value="none"
							className="flex items-center justify-between space-x-2 !pl-2 focus:bg-accent/50"
						>
							<div className="flex min-w-[8rem] items-center gap-2">
								<span className="text-muted-foreground">
									<MinusIcon />
								</span>
								<p>No Grouping</p>
							</div>
						</SelectItem>
				{properties.map((property) => {
					const config = getTaskConfig(property);

					if (config.type !== "select") return null;

					return (
						<SelectItem
							key={config.value}
							value={config.value}
							className="flex items-center justify-between space-x-2 !pl-2 focus:bg-accent/50"
						>
							<div className="flex min-w-[8rem] items-center gap-2">
								<span className="text-muted-foreground">
									{config.icon}
								</span>
								<p>{config.displayName}</p>
							</div>
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
};

export default GroupButton;
