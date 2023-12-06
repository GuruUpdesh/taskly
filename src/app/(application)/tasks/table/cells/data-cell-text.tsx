"use client";

import React, { useEffect } from "react";

// ui
import { TableCell } from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { NewTask } from "~/server/db/schema";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { EntityFieldConfig } from "~/entities/entityTypes";
import { cn } from "~/lib/utils";

type DataCellProps = {
	config: EntityFieldConfig;
	col: keyof NewTask;
	form: UseFormReturn<NewTask>;
	onSubmit: (newTask: NewTask) => Promise<void>;
	autoFocus?: boolean;
};

function DataCell({ config, col, form, onSubmit, autoFocus=false }: DataCellProps) {
	// handle enter key
	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			form.handleSubmit(onSubmit)();
		}
	};

	// handle error tooltips
	const [isTipOpen, setIsTipOpen] = React.useState(false);
	useEffect(() => {
		if (form.formState.errors[col]) {
			setIsTipOpen(true);
		} else {
			setIsTipOpen(false);
		}
	}, [form.formState.errors[col]]);

	function handleOpenChange(open: boolean) {
		if (!open && isTipOpen) {
			setIsTipOpen(false);
		} else if (form.formState.errors[col]) {
			setIsTipOpen(true);
		}
	}

	return (
		<TableCell className="border p-0">
			<TooltipProvider>
				<Tooltip open={isTipOpen} onOpenChange={handleOpenChange}>
					<TooltipTrigger asChild>
						<Input
							type="text"
							className={cn(
								"focus-visible:-ring-offset-2 m-0 border-none px-4",
								{
									"opacity-80":
										col === "description",
									"font-medium": col === "title",
								},
							)}
							{...form.register(col)}
							onKeyDown={handleKeyDown}
							placeholder={config.form.placeholder}
							autoFocus={autoFocus}
						/>
					</TooltipTrigger>
					<TooltipContent
						className=" border-red-500 bg-red-900 text-red-200"
						side="bottom"
					>
						<p>{form.formState.errors[col]?.message}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</TableCell>
	);
}

export default DataCell;
