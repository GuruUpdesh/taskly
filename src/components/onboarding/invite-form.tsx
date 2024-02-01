"use client";

// hooks
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

// data
import { type NewProject, insertProjectSchema } from "~/server/db/schema";

// utils
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "~/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createProject } from "~/actions/project-actions";
import { ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { throwClientError } from "~/utils/errors";
import { successToast } from "~/utils/success";
import { Textarea } from "../ui/textarea";

const InviteForm = () => {
	const [isLoading, startTransition] = useTransition();
	const router = useRouter();

	// form hooks
	const form = useForm<NewProject>({
		resolver: zodResolver(insertProjectSchema),
		defaultValues: {
			name: "",
		},
	});

	// New state variable for the current step
	const [step, setStep] = useState(1);

	async function onSubmit(data: NewProject) {
		const { newProjectId, status, message } = await createProject(data);
		if (!status) {
			throwClientError(message);
			return;
		}
		if (newProjectId) {
			// setStep(2);
		}

		successToast(message);

		form.reset();
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((data: NewProject) =>
					startTransition(() => onSubmit(data)),
				)}
				className="flex flex-col rounded-lg border bg-background/75 p-4 backdrop-blur-lg shadow-xl"
			>
				<div className="text-center">
					<h1 className="mb-2 text-2xl tracking-tight">
						Create a Project
					</h1>
					<p className="mb-4 border-b pb-4 text-sm text-muted-foreground">
						Projects are a shared space for your team to collaborate
						on tasks.
					</p>
				</div>
				<Textarea
					// {...form.register("name")}
					placeholder="Describe your project so our system can better provide suggestions (optional)"
					className="mb-4 w-full rounded-md border px-4 py-2"
				/>

				<Button type="submit" disabled={isLoading}>
					{isLoading ? (
						<>
							Creating
							<Loader2 className="ml-2 h-4 w-4 animate-spin" />
						</>
					) : (
						<>
							Create
							<ChevronRight className="ml-2 h-4 w-4" />
						</>
					)}
				</Button>
			</form>
		</Form>
	);
};

export default InviteForm;
