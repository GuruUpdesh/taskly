"use client";

import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { handleProjectInfo } from "~/features/settings/actions/settings-actions";
import safeAsync from "~/lib/safe-action";
import { cn } from "~/lib/utils";
import { type Project } from "~/schema";
import typography from "~/styles/typography";

type Props = {
	project: Project;
};

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const formSchema = z.object({
	name: z.string().min(3).max(100),
	description: z.string().max(1000),
	isAiEnabled: z.boolean(),
	color: z.string().regex(hexColorRegex, "Invalid hex color"),
});

const ProjectInfo = ({ project }: Props) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			isAiEnabled: false,
			color: project.color,
		},
	});

	function resetForm() {
		form.reset({
			name: project.name,
			description: project.description ?? "",
			isAiEnabled: project.isAiEnabled,
			color: project.color,
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
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="grid w-full items-center gap-1.5"
				>
					<div className="rounded-md border bg-background-dialog">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type="text"
											id="projectName"
											className="text-md rounded-none border-none bg-transparent"
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
											className="max-h-[300px] rounded-none border-none bg-transparent"
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
					</div>
					<p className={cn(typography.paragraph.p_muted, "text-sm")}>
						{(form.watch("description") ?? "").length}/1000
					</p>
					<FormField
						control={form.control}
						name="isAiEnabled"
						render={({ field }) => (
							<FormItem className="mb-4 flex flex-row items-center justify-between rounded-md border bg-background-dialog px-4 py-3">
								<div className="mr-8 space-y-0.5">
									<FormLabel>
										Artificial Intelligence
									</FormLabel>
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
					<FormField
						control={form.control}
						name="color"
						render={({ field }) => (
							<FormItem className="mb-4 flex flex-row items-center justify-between rounded-md border bg-background-dialog px-4 py-3">
								<div className="mr-8 space-y-0.5">
									<FormLabel>Customize theme color</FormLabel>
									<FormDescription>
										Choose a color that represents your
										project.
									</FormDescription>
									<FormMessage />
								</div>
								<div className="flex items-center gap-2">
									<Popover>
										<PopoverTrigger asChild>
											<button
												className="aspect-square h-[30px] rounded border"
												style={{
													backgroundColor: form
														.formState.isValid
														? form.getValues(
																"color",
															)
														: project.color,
												}}
											></button>
										</PopoverTrigger>
										<PopoverContent className="max-w-min border-none bg-transparent">
											<HexColorPicker
												color={form.watch("color")}
												onChange={(color) =>
													form.setValue(
														"color",
														color,
														{
															shouldValidate:
																true,
															shouldDirty: true,
														},
													)
												}
											/>
										</PopoverContent>
									</Popover>
									<FormControl>
										<Input
											type="text"
											id="projectName"
											className="text-md w-24 border-none bg-transparent"
											{...field}
										/>
									</FormControl>
								</div>
							</FormItem>
						)}
					/>
					<div className="ml-auto flex items-center gap-4">
						<Button
							size="sm"
							variant="secondary"
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
							{form.formState.isSubmitting ? "Saving" : "Save"}
							{form.formState.isSubmitting ? (
								<Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
							) : null}
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
};

export default ProjectInfo;
