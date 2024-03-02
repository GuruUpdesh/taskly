"use client";

import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Loader2Icon, SparkleIcon } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
	autoColor,
	handleProjectTheme,
} from "~/actions/settings/settings-actions";
import ImageUploadArea from "~/components/general/image-upload-area";
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
import safeAsync from "~/lib/safe-action";
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

const colors = [
	"#ff7f50",
	"#87cefa",
	"#da70d6",
	"#32cd32",
	"#6495ed",
	"#ff69b4",
	"#ba55d3",
	"#cd5c5c",
	"#ffa500",
	"#40e0d0",
];

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

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="grid w-full items-center gap-1.5"
			>
				<Label>Project Icon</Label>
				<p className={typography.paragraph.p_muted}>
					You can upload a custom icon for your project. Or we can
					generate one for you.
				</p>
				<div className="mt-2 grid grid-cols-3 gap-4">
					<div className="relative flex aspect-video items-center justify-center overflow-hidden rounded border bg-accent/25">
						<Image
							src={
								form.watch("image") ?? "/static/img-missing.jpg"
							}
							alt="Project Icon"
							width={85}
							height={85}
							className="z-10 rounded-full"
							quality={100}
						/>
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
										form.formState.isSubmitting || isLoading
									}
								>
									<SparkleIcon className="h-4 w-4" />
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
									<PopoverContent className="grid w-[200px] grid-cols-5 gap-1">
										{colors.map((c) => (
											<button
												type="button"
												key={c}
												style={{ backgroundColor: c }}
												onClick={() => {
													field.onChange(c);
												}}
												className="aspect-square h-[30px] rounded border"
											></button>
										))}
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
