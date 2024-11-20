"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { PersonIcon } from "@radix-ui/react-icons";
import { endOfYesterday } from "date-fns";
import { ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { type CreateForm, createProject } from "~/actions/create-project";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { sendEmailInvites } from "~/features/invite/actions/invite-actions";
import EmailInviteForm from "~/features/invite/components/by-email/email-invite-form";
import InviteLink from "~/features/invite/components/invite-link";
import { cn } from "~/lib/utils";

const CreateProjectSchema = z.object({
	name: z.string().min(1).max(25),
	isAiEnabled: z.boolean(),
	description: z.string().optional(),
	sprintDuration: z.number().min(1).max(4),
	sprintStart: z.date().min(endOfYesterday()),
	invitees: z.array(z.string().email()),
	timezoneOffset: z.number(),
});

type Props = {
	className?: string;
};

const CreateProjectForm = ({ className }: Props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [showInvites, setShowInvites] = useState(false);

	const form = useForm<CreateForm>({
		resolver: zodResolver(CreateProjectSchema),
		defaultValues: {
			name: "",
			isAiEnabled: true,
			sprintDuration: 2,
			sprintStart: new Date(),
			invitees: [],
			timezoneOffset: new Date().getTimezoneOffset(),
		},
	});

	const {
		formState: { isValid },
		register,
		handleSubmit,
		setValue,
	} = form;

	type NewProjectData = {
		newProjectId: number;
		inviteToken: string | null;
	};

	const [newProjectData, setNewProjectData] = useState<NewProjectData>({
		newProjectId: -1,
		inviteToken: null,
	});

	async function handleCreateProject(data: CreateForm) {
		setIsLoading(true);
		const result = await createProject(data);

		if (result.status && result.inviteToken) {
			toast.success(result.message);
			setNewProjectData({
				newProjectId: result.newProjectId,
				inviteToken: result.inviteToken,
			});
			setShowInvites(true);
		} else {
			toast.error(result.message);
		}
		setIsLoading(false);
	}

	async function sendInvites() {
		const invitees = form.watch("invitees");

		if (invitees.length == 0) return;

		const inviteResult = await sendEmailInvites(
			newProjectData.newProjectId,
			form.watch("invitees"),
		);

		if (!inviteResult.status) {
			toast.error(inviteResult.message, {
				icon: <PersonIcon className="h-4 w-4" />,
			});
		} else {
			toast.success(inviteResult.message, {
				icon: <PersonIcon className="h-4 w-4" />,
			});
		}
	}

	return (
		<div className={cn("flex", className)}>
			<Form {...form}>
				<form
					className="flex w-[600px] flex-col p-8"
					onSubmit={handleSubmit(handleCreateProject)}
				>
					{!showInvites ? (
						<>
							<h1 className="mb-8 text-3xl font-semibold">
								Create Project
							</h1>
							<section className="flex flex-col gap-6">
								<FormField
									control={form.control}
									name="name"
									render={() => (
										<FormItem>
											<FormControl>
												<Input
													disabled={isLoading}
													id="name"
													type="text"
													{...register("name")}
													placeholder="Name"
													className="w-full rounded-md border bg-accent/50 px-4 py-2"
													autoFocus={true}
													autoComplete="off"
												/>
											</FormControl>
											<FormMessage className="text-red-500" />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="isAiEnabled"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-md border bg-background-dialog px-4 py-3">
											<div className="mr-8 space-y-0.5">
												<FormLabel>
													AI Features
												</FormLabel>
												<FormDescription>
													Task creator and smart
													properties.
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													disabled={isLoading}
													checked={field.value}
													onCheckedChange={
														field.onChange
													}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="sprintDuration"
									render={({ field }) => (
										<FormItem className="flex w-full items-center justify-between rounded-md border bg-background-dialog px-4 py-3">
											<div className="mr-8 space-y-0.5">
												<FormLabel className="whitespace-nowrap font-bold">
													Sprint Duration
												</FormLabel>
												<FormDescription className="text-sm text-muted-foreground">
													How long each work period
													will last.
												</FormDescription>
											</div>
											<Select
												onValueChange={(val) =>
													field.onChange(
														parseInt(val),
													)
												}
												value={field.value.toString()}
												disabled={isLoading}
											>
												<SelectTrigger className="group max-w-[200px] border-none bg-transparent hover:bg-accent">
													<SelectValue placeholder="Select Sprint Duration" />
													<ChevronDown className="ml-2 h-4 w-4 transition-transform group-data-[state=open]:-rotate-180" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem
														value="1"
														className="flex items-center space-x-2 !pl-2 focus:bg-accent/50"
													>
														1 Week
													</SelectItem>
													<SelectItem
														value="2"
														className="flex items-center space-x-2 !pl-2 focus:bg-accent/50"
													>
														2 Weeks
													</SelectItem>
													<SelectItem
														value="3"
														className="flex items-center space-x-2 !pl-2 focus:bg-accent/50"
													>
														3 Weeks
													</SelectItem>
													<SelectItem
														value="4"
														className="flex items-center space-x-2 !pl-2 focus:bg-accent/50"
													>
														4 Weeks
													</SelectItem>
												</SelectContent>
											</Select>
										</FormItem>
									)}
								/>
								<Button disabled={!isValid || isLoading}>
									{isLoading && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{isLoading
										? "Creating Project..."
										: "Create Project"}
								</Button>
							</section>
						</>
					) : (
						<>
							<h1 className="mb-8 text-3xl font-semibold">
								Invite Your Team
							</h1>
							<section className="flex flex-col gap-4">
								<div>
									<p className="mb-2">Send an email invite</p>
									<EmailInviteForm
										setInvitees={(invitees) =>
											setValue("invitees", invitees)
										}
										autoFocus
									/>
								</div>
								{newProjectData.inviteToken && (
									<div>
										<p className="mb-2">
											or Share this link
										</p>
										<InviteLink
											token={newProjectData.inviteToken}
										/>
									</div>
								)}
								<Button asChild>
									<Link
										href={`/project/${newProjectData.newProjectId}/tasks`}
										onClick={sendInvites}
									>
										Continue to Project
									</Link>
								</Button>
							</section>
						</>
					)}
				</form>
			</Form>
		</div>
	);
};

export default CreateProjectForm;
