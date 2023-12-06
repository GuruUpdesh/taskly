"use client";

import React, { useEffect } from "react";

// ui
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { UseFormRegisterReturn, UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { NewTask, Task } from "~/server/db/schema";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import getPlaceholder from "../../utils/get-placeholder";

type DataCellProps = {
	col: keyof NewTask;
	form: UseFormReturn<NewTask>;
	onSubmit: (newTask: NewTask) => Promise<void>;
};

function DataCell({ col, form, onSubmit }: DataCellProps) {
	// async function onSubmit(data: FormValues) {
	// 	if (data.value === value) return;
	//     await updateValue(col, data.value);
	// }

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			form.handleSubmit(onSubmit)();
		}
	};

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
							className="focus-visible:-ring-offset-2 m-0 border-none px-4"
							{...form.register(col)}
							onKeyDown={handleKeyDown}
							placeholder={getPlaceholder(col)}
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
