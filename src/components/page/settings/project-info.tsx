"use client";

import React, { useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { type Project } from "~/server/db/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { ChevronRight, Loader2Icon } from "lucide-react";
import { cn } from "~/lib/utils";
import typography from "~/styles/typography";
import { handleProjectInfo } from "~/actions/settings/settings-actions";
import safeAsync from "~/lib/safe-action";

type Props = {
	project: Project;
};

const formSchema = z.object({
	name: z.string().min(3).max(100),
	description: z.string().max(1000),
});

const ProjectInfo = ({ project }: Props) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	useEffect(() => {
		form.reset(
			{
				name: project.name,
				description: project.description ?? "",
			},
			{
				keepIsSubmitted: false,
			},
		);
	}, [project]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await safeAsync(handleProjectInfo(project.id, values));
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="grid w-full items-center gap-1.5"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									type="text"
									id="projectName"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									className="max-h-[300px]"
									id="projectDescription"
									placeholder="Describe your project so our system can better provide suggestions..."
									{...field}
									value={field.value ?? ""}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<p className={cn(typography.paragraph.p_muted)}>
					{(form.watch("description") ?? "").length}/1000
				</p>
				<Button
					className="ml-auto"
					disabled={
						!form.formState.isDirty || form.formState.isSubmitting
					}
				>
					{form.formState.isSubmitting ? "Saving" : "Save"}
					{form.formState.isSubmitting ? (
						<Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
					) : (
						<ChevronRight className="ml-2 h-4 w-4" />
					)}
				</Button>
			</form>
		</Form>
	);
};

export default ProjectInfo;
