"use client";

import React, {useEffect} from "react";

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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Task } from "~/server/db/schema";

type DataCellProps = {
    col: keyof Task;
	value: string;
	validator: z.ZodObject<{ value: z.ZodTypeAny }>;
    updateValue: (key: keyof Task, value: string) => Promise<void>;
};

function DataCell({ col, value, validator, updateValue }: DataCellProps) {
	console.log(value);
	type FormValues = {
		value: string;
	};

	const form = useForm<FormValues>({
		resolver: zodResolver(validator),
		defaultValues: {
			value: value,
		},
	});

	useEffect(() => {
		form.reset({ value: value });
	}, [value]);

	async function onSubmit(data: FormValues) {
        if (data.value === value) return;
        await updateValue(col, data.value);
	}

	const handleBlur = () => {
		form.handleSubmit(onSubmit)();
	};

	return (
		<TableCell className="border p-0">
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Input
					className="focus-visible:-ring-offset-2 m-0 border-none px-4"
					type="text"
					{...form.register("value")}
					onBlur={handleBlur}
					placeholder="Untitled"
				/>
			</form>
		</TableCell>
	);
}

export default DataCell;
