"use client";

// hooks
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";

// data
import { type NewProject, insertProjectSchema } from "~/server/db/schema";

// utils
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormLabel } from "~/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createProject } from "~/actions/project-actions";
import { ChevronRight, Loader2 } from "lucide-react";

const ProjectCreateForm = () => {
	const [isLoading, startTransition] = useTransition();

	// options
	// const [error, setError] = React.useState(false);

	const [showDiv, setShowDiv] = React.useState(false);

	// form hooks
	const form = useForm<NewProject>({
		resolver: zodResolver(insertProjectSchema),
		defaultValues: {
			name: "",
		},
	});

	async function onSubmit(data: NewProject) {
		try {
			await createProject(data);

			setShowDiv(!showDiv);
			form.reset();
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>
			{showDiv && (
				<div className="mb-4 flex w-full items-center justify-between rounded-md bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
					<p>Project created successfully</p>
				</div>
			)}
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((data: NewProject) =>
						startTransition(() => onSubmit(data)),
					)}
					className="flex flex-col gap-2 rounded-lg bg-foreground/5 p-4 shadow-md"
				>
					<FormLabel htmlFor="name" className="text-sm font-medium">
						Name
						<span className="text-red-500">*</span>
					</FormLabel>
					<Input
						type="text"
						{...form.register("name")}
						placeholder="Name"
						className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>

					<Button
						type="submit"
						variant="outline"
						disabled={isLoading}
						className="mt-4 inline-flex w-48 items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
					>
						{isLoading ? (
							<>
								Submitting
								<Loader2 className="ml-2 h-4 w-4 animate-spin" />
							</>
						) : (
							<>
								Submit
								<ChevronRight className="ml-2 h-4 w-4" />
							</>
						)}
					</Button>
				</form>
			</Form>
		</>
	);
};

export default ProjectCreateForm;
