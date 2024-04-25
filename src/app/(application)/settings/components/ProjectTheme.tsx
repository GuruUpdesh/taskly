"use client";

import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	ChevronRight,
	Loader2Icon,
	RefreshCw,
	SparkleIcon,
} from "lucide-react";
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
import { Label } from "~/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import safeAsync from "~/lib/safe-action";
import { cn } from "~/lib/utils";
import { type Project } from "~/server/db/schema";
import typography from "~/styles/typography";

type Props = {
	project: Project;
};

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const formSchema = z.object({
	image: z.string().url(),
	color: z.string().regex(hexColorRegex, "Invalid hex color"),
});

const ProjectTheme = ({ project }: Props) => {
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
				<div className="flex items-center justify-between">
					<Label>Project Icon</Label>
					<SimpleTooltip label="Re-generate Project Icon">
						<Button
							disabled={!form.formState.isValid || isRegenerating}
							type="button"
							variant="outline"
							size="icon"
							className="h-[30px] w-[30px] rounded-sm"
							onClick={handleAIGenerate}
						>
							<RefreshCw
								className={cn("h-4 w-4", {
									"animate-spin": isRegenerating,
								})}
							/>
						</Button>
					</SimpleTooltip>
				</div>
				<p className={typography.paragraph.p_muted}>
					You can upload a custom icon for your project. Or we can
					generate one for you.
				</p>
				<div className="mt-2 grid grid-cols-3 gap-4">
					<div className="relative flex aspect-video items-center justify-center overflow-hidden rounded border bg-accent/25">
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
				<Separator className="my-3" />
				<FormField
					control={form.control}
					name="color"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between">
							<div className="mr-8 space-y-0.5">
								<FormLabel>Customize theme color</FormLabel>
								<FormDescription>
									Choose a color that represents your project.
								</FormDescription>
								<FormMessage />
							</div>
							<div className="flex items-center gap-2">
								<Button
									onClick={handleAutoColor}
									type="button"
									variant="outline"
									size="icon"
									className="h-[30px] w-[30px] rounded-sm"
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
										className="text-md w-24 bg-accent/25"
										{...field}
									/>
								</FormControl>
							</div>
						</FormItem>
					)}
				/>
				<Separator className="my-3" />
				<div className="ml-auto flex items-center gap-4">
					{!form.watch("image") && (
						<p className="flex-grow text-sm">
							Your project icon is generating
						</p>
					)}

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
							!form.formState.isValid ||
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

export default ProjectTheme;
