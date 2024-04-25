"use client";

import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { handleProjectInfo } from "~/actions/settings/settings-actions";
import { Button } from "~/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import safeAsync from "~/lib/safe-action";
import { cn } from "~/lib/utils";
import { type Project } from "~/server/db/schema";
import typography from "~/styles/typography";

type Props = {
	project: Project;
};

const formSchema = z.object({
	name: z.string().min(3).max(100),
	description: z.string().max(1000),
	isAiEnabled: z.boolean(),
});

const ProjectInfo = ({ project }: Props) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			isAiEnabled: false,
		},
	});

	function resetForm() {
		form.reset({
			name: project.name,
			description: project.description ?? "",
			isAiEnabled: project.isAiEnabled,
		});
	}

	useEffect(() => {
		resetForm();
	}, [project]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const result = await safeAsync(handleProjectInfo(project.id, values));
		if (result[1]) {
			return;
		}
		toast.success("Project updated");
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
							<FormLabel>Name & Description</FormLabel>
							<FormDescription className="!mt-0">
								Pick a name and describe your project so that
								our system can provide more accurate
								suggestions, to your workflow.
							</FormDescription>
							<FormControl>
								<Input
									type="text"
									id="projectName"
									className="text-md bg-accent/25"
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
							<FormControl>
								<Textarea
									className="max-h-[300px] bg-accent/25"
									id="projectDescription"
									placeholder="Describe your project..."
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
				<Separator className="my-3" />
				<FormField
					control={form.control}
					name="isAiEnabled"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between">
							<div className="mr-8 space-y-0.5">
								<FormLabel>Artificial Intelligence</FormLabel>
								<FormDescription>
									If you enable this feature, you agree to
									Open AI&apos;s{" "}
									<a
										href="https://openai.com/policies/terms-of-use"
										target="_blank"
										className="underline"
									>
										terms of service
									</a>
									.
								</FormDescription>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Separator className="my-3" />
				<div className="ml-auto flex items-center gap-4">
					<Button
						size="sm"
						variant="outline"
						type="button"
						onClick={(e) => {
							e.preventDefault();
							resetForm();
						}}
						disabled={
							!form.formState.isDirty ||
							form.formState.isSubmitting
						}
					>
						Cancel
					</Button>
					<Button
						size="sm"
						disabled={
							!form.formState.isDirty ||
							form.formState.isSubmitting
						}
					>
						{form.formState.isSubmitting
							? "Saving Changes"
							: "Save Changes"}
						{form.formState.isSubmitting ? (
							<Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
						) : (
							<ChevronRight className="ml-2 h-4 w-4" />
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default ProjectInfo;
