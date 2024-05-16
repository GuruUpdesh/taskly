"use client";

import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, RefreshCw, SparkleIcon } from "lucide-react";
import Image from "next/image";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { generateAndUpdateProjectImage } from "~/actions/onboarding/create-project";
import {
	autoColor,
	handleProjectTheme,
} from "~/actions/settings/settings-actions";
import ImageUploadArea from "~/app/components/ImageUploadArea";
import SimpleTooltip from "~/app/components/SimpleTooltip";
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
import { Skeleton } from "~/components/ui/skeleton";
import { AIDAILYLIMIT, timeTillNextReset } from "~/config/aiLimit";
import safeAsync from "~/lib/safe-action";
import { cn } from "~/lib/utils";
import { type Project } from "~/server/db/schema";

type Props = {
	project: Project;
	aiLimitCount: number;
};

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const formSchema = z.object({
	image: z.string().url(),
	color: z.string().regex(hexColorRegex, "Invalid hex color"),
});

const ProjectTheme = ({ project, aiLimitCount }: Props) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		mode: "onChange",
		defaultValues: {
			image: "",
			color: project.color,
		},
	});

	function resetForm() {
		form.reset({
			image: project.image ?? "",
			color: project.color,
		});
	}

	useEffect(() => {
		resetForm();
	}, [project]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const result = await safeAsync(handleProjectTheme(project.id, values));
		if (result[1]) {
			return;
		}
		toast.success("Appearance updated");
	}

	const [isLoading, setIsLoading] = useState(false);
	async function handleAutoColor() {
		setIsLoading(true);
		const result = await autoColor(
			form.getValues("image") ?? project.image,
		);
		form.setValue("color", result, {
			shouldValidate: true,
			shouldDirty: true,
		});
		setIsLoading(false);
	}

	const [isRegenerating, setIsRegenerating] = useState(false);

	async function handleAIGenerate() {
		if (aiLimitCount >= AIDAILYLIMIT) {
			toast.error(
				`AI daily limit reached. Please try again in ${timeTillNextReset()} hours.`,
			);
			return;
		}
		setIsRegenerating(true);
		await generateAndUpdateProjectImage(
			project.id,
			project.name,
			project.description,
		);
		setIsRegenerating(false);
	}

	useEffect(() => {
		if (form.watch("image") && form.formState.isDirty) {
			void handleAutoColor();
		}
	}, [form.watch("image")]);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="grid w-full items-center gap-1.5"
			>
				<div className="mb-4 mt-2 grid grid-cols-3 gap-4">
					<div className="group relative flex aspect-video items-center justify-center overflow-hidden rounded border bg-accent/25">
						{form.watch("image") ? (
							<Image
								src={form.watch("image")}
								alt="Project Icon"
								width={85}
								height={85}
								className="z-10 rounded-full"
								quality={100}
							/>
						) : (
							<Skeleton className="h-[85px] w-[85px] rounded-full" />
						)}
						<Image
							src={
								form.watch("image") ?? "/static/img-missing.jpg"
							}
							alt=""
							fill={true}
							className="absolute inset-0 blur-3xl"
							style={{ backdropFilter: "blur(10px)" }}
						/>
						<SimpleTooltip label="Re-generate Project Icon">
							<Button
								disabled={
									!form.formState.isValid || isRegenerating
								}
								type="button"
								variant="outline"
								size="icon"
								className={cn(
									"absolute z-10 h-[90px] w-[90px] rounded-sm border-none !bg-transparent opacity-0 transition-opacity group-hover:opacity-100",
									{
										"opacity-100": isRegenerating,
									},
								)}
								onClick={handleAIGenerate}
							>
								<RefreshCw
									className={cn("h-6 w-6", {
										"animate-spin": isRegenerating,
									})}
								/>
							</Button>
						</SimpleTooltip>
					</div>
					<ImageUploadArea
						key={form.watch("image")}
						urlCallback={(url) => {
							form.setValue("image", url, {
								shouldValidate: true,
								shouldDirty: true,
							});
						}}
					/>
				</div>
				<FormField
					control={form.control}
					name="color"
					render={({ field }) => (
						<FormItem className="mb-4 flex flex-row items-center justify-between rounded-md border bg-background-dialog px-4 py-3">
							<div className="mr-8 space-y-0.5">
								<FormLabel>Customize theme color</FormLabel>
								<FormDescription>
									Choose a color that represents your project.
								</FormDescription>
								<FormMessage />
							</div>
							<div className="flex items-center gap-2">
								<SimpleTooltip label="Get color from image">
									<Button
										onClick={handleAutoColor}
										type="button"
										variant="outline"
										size="icon"
										className="h-[30px] w-[30px] rounded-sm bg-transparent"
										disabled={
											form.formState.isSubmitting ||
											isLoading ||
											!form.formState.isValid
										}
									>
										{isLoading ? (
											<Loader2Icon className="h-4 w-4 animate-spin" />
										) : (
											<SparkleIcon className="h-4 w-4" />
										)}
									</Button>
								</SimpleTooltip>
								<Popover>
									<PopoverTrigger asChild>
										<button
											className="aspect-square h-[30px] rounded border"
											style={{
												backgroundColor: form.formState
													.isValid
													? form.getValues("color")
													: project.color,
											}}
										></button>
									</PopoverTrigger>
									<PopoverContent className="max-w-min border-none bg-transparent">
										<HexColorPicker
											color={form.watch("color")}
											onChange={(color) =>
												form.setValue("color", color, {
													shouldValidate: true,
													shouldDirty: true,
												})
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
					{!form.watch("image") && (
						<p className="flex-grow text-sm">
							Your project icon is generating
						</p>
					)}

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
							!form.formState.isValid ||
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
	);
};

export default ProjectTheme;
