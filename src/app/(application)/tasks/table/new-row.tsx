"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

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
import { NewTask, insertTaskSchema } from "~/server/db/schema";

type Props = {};

const NewRow = (props: Props) => {
	const [showForm, setShowForm] = useState(false);

	// form hooks
	const form = useForm<NewTask>({
		resolver: zodResolver(insertTaskSchema),
		defaultValues: {
			title: "",
			description: "",
			status: "todo",
			priority: "medium",
			type: "task",
		},
	});

	if (showForm) {
		return <></>;
	}

	return (
		<TableRow>
			<TableCell className="p-0" colSpan={6}>
				<Button
					variant="ghost"
					className="flex w-full justify-start opacity-50 "
					onClick={() => setShowForm(true)}
				>
					<Plus className="mr-2 h-4 w-4" /> New
				</Button>
			</TableCell>
		</TableRow>
	);
};

export default NewRow;
