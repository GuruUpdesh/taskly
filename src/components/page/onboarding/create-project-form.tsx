"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
	ChevronLeft,
	ChevronRight,
	Loader2,
	PlusIcon,
	SparkleIcon,
	Sprout,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { useRouter } from "next/navigation";
import EmailInviteForm from "~/components/invite/by-email/email-invite-form";
import SprintOptions from "~/components/projects/sprint-options/sprint-options";
import { endOfYesterday, isMonday, nextMonday } from "date-fns";
import StepButton from "./multi-step-form/step-button";
import Step from "./multi-step-form/step";
import StepHeader from "./multi-step-form/step-header";
import { PiPersonSimpleRun } from "react-icons/pi";
import { GoPeople } from "react-icons/go";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Separator } from "~/components/ui/separator";
import {
	type CreateForm,
	createProject,
} from "~/actions/onboarding/create-project";
import InviteLink from "~/components/invite/invite-link";
import { sendEmailInvites } from "~/actions/onboarding/invite-actions";
import { type ProjectSprintOptions } from "~/components/projects/sprint-options/sprint-options-form";

const CreateProjectSchema = z.object({
	name: z.string().min(3).max(25),
	description: z.string().optional(),
	sprintDuration: z.number().min(1).max(4),
	sprintStart: z.date().min(endOfYesterday()),
	invitees: z.array(z.string().email()),
	timezoneOffset: z.number(),
});

const CreateProjectForm = () => {
	const router = useRouter();

	const form = useForm<CreateForm>({
		mode: "onChange",
		resolver: zodResolver(CreateProjectSchema),
		defaultValues: {
			name: "",
			sprintDuration: 2,
			sprintStart: isMonday(new Date())
				? new Date()
				: nextMonday(new Date()),
			invitees: [],
			timezoneOffset: new Date().getTimezoneOffset(),
		},
	});

	const {
		formState: { isValid },
		register,
		watch,
		handleSubmit,
		reset,
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
	const [formStep, setFormStep] = useState(1);
	async function initializeProject(formData: CreateForm) {
		const result = await createProject(formData);
		if (result.status && result.inviteToken) {
			toast.success(result.message);
			setNewProjectData({
				newProjectId: result.newProjectId,
				inviteToken: result.inviteToken,
			});
			setFormStep(4);
		} else {
			toast.error(result.message);
			setFormStep(1);
			reset();
			return;
		}
	}

	async function sendInvites(formData: CreateForm) {
		const inviteResult = await sendEmailInvites(
			newProjectData.newProjectId,
			formData.invitees,
		);
		if (!inviteResult.status) {
			toast.error(inviteResult.message);
		} else {
			toast.success(inviteResult.message);
		}
	}

	useEffect(() => {
		if (formStep === 3) {
			void handleSubmit(initializeProject)();
		} else if (formStep === 5) {
			void handleSubmit(sendInvites)();
			router.push(`/project/${newProjectData.newProjectId}/backlog`);
		}
	}, [formStep]);

	function isStepValid(step: number) {
		if (step === 1) {
			return isValid;
		} else if (step === 2) {
			return isValid;
		} else if (step === 3) {
			return false;
		} else if (step === 4) {
			return (
				newProjectData.newProjectId !== -1 && newProjectData.inviteToken
			);
		}
		return false;
	}

	return (
		<div className="flex min-h-[500px] rounded-lg border bg-background/75 shadow-xl backdrop-blur-lg">
			<div className="m-4 mr-0 flex flex-col gap-8 rounded-lg border bg-accent-foreground/5 p-4 pr-8">
				<StepButton
					step={1}
					currentStep={formStep}
					setStep={setFormStep}
					disabled={formStep > 2}
					stepTitle="Create Project"
				>
					<Sprout className="h-3.5 w-3.5" />
				</StepButton>
				<StepButton
					step={2}
					currentStep={formStep}
					setStep={setFormStep}
					disabled={!isStepValid(1) || formStep > 2}
					stepTitle="Configure Sprints"
				>
					<PiPersonSimpleRun className="h-3.5 w-3.5" />
				</StepButton>
				<div className="flex w-full flex-grow flex-col items-center justify-center gap-3 overflow-hidden">
					<Separator orientation="vertical" />
					<div>
						<StepButton
							step={3}
							currentStep={formStep}
							setStep={setFormStep}
							disabled={true}
							stepTitle="Initialize Project"
						>
							<PlusIcon className="h-3.5 w-3.5" />
						</StepButton>
					</div>
					<Separator orientation="vertical" />
				</div>
				<StepButton
					step={4}
					currentStep={formStep}
					setStep={setFormStep}
					disabled={!isStepValid(4)}
					stepTitle="Invite Your Team"
				>
					<GoPeople className="h-3.5 w-3.5" />
				</StepButton>
			</div>
			<Form {...form}>
				<form className="flex w-[600px] flex-col p-8">
					<Step visible={formStep === 1}>
						<StepHeader
							header="Create a Project"
							description="Projects are a shared space for your team to
									collaborate on tasks."
						>
							<Sprout />
						</StepHeader>
						<section className="flex flex-col gap-4">
							<FormField
								control={form.control}
								name="name"
								render={() => (
									<FormItem>
										<FormLabel className="relative flex items-center font-bold">
											Name
										</FormLabel>
										<FormControl>
											<Input
												id="name"
												type="text"
												{...register("name")}
												placeholder="Project Name"
												className={cn(
													"w-full rounded-md border px-4 py-2",
												)}
												autoFocus
												autoComplete="off"
												hidden={formStep !== 1}
											/>
										</FormControl>
										<FormMessage className="text-red-500" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={() => (
									<FormItem>
										<FormLabel className="flex items-center gap-1 font-bold">
											<div className="rounded-md bg-accent-foreground p-1 text-xs text-background">
												<SparkleIcon className="h-3 w-3" />
											</div>
											Description
										</FormLabel>
										<FormControl>
											<Textarea
												{...register("description")}
												placeholder="Describe your project so our system can better provide suggestions (optional)"
												className="mb-4 w-full rounded-md border px-4 py-2"
												rows={6}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</section>
					</Step>
					<Step visible={formStep === 2}>
						<StepHeader
							header="Configure Sprints"
							description="Sprints are a vital part of any project management system. Configure your sprints to match your team's workflow."
						>
							<PiPersonSimpleRun />
						</StepHeader>
						<SprintOptions
							form={
								form as unknown as UseFormReturn<ProjectSprintOptions>
							}
							hidden={formStep !== 2}
						/>
					</Step>
					<Step visible={formStep === 3}>
						<div className="flex h-full w-full items-center justify-center gap-2">
							<Loader2 className="ml-2 h-4 w-4 animate-spin" />
							Creating project...
						</div>
					</Step>
					<Step visible={formStep === 4}>
						<StepHeader
							header="Invite Your Team"
							description="Project management is a team sport. Invite your team to collaborate on this project."
						>
							<GoPeople />
						</StepHeader>
						<section className="flex flex-col gap-4">
							<div>
								<FormLabel className="flex items-center gap-1 font-bold">
									Emails
								</FormLabel>
								<EmailInviteForm
									invitees={watch("invitees").join(", ")}
									setInvitees={(invitees) =>
										setValue("invitees", invitees)
									}
									autoFocus
								/>
							</div>
							{newProjectData.inviteToken && (
								<div>
									<FormLabel className="flex items-center gap-1 font-bold">
										Invite Link
									</FormLabel>
									<InviteLink
										token={newProjectData.inviteToken}
									/>
								</div>
							)}
						</section>
					</Step>
					<Step visible={formStep === 5}>
						<div className="flex h-full w-full items-center justify-center gap-2">
							<Loader2 className="ml-2 h-4 w-4 animate-spin" />
							Launching...
						</div>
					</Step>
					<div className="flex-grow" />
					<div className="flex justify-end gap-2">
						{formStep > 1 && formStep < 3 ? (
							<Button
								type="button"
								variant="ghost"
								disabled={!isValid || formStep === 4}
								onClick={() => setFormStep((prev) => prev - 1)}
							>
								<ChevronLeft className="mr-2 h-4 w-4" />
								Back
							</Button>
						) : null}
						<Button
							type="button"
							disabled={!isStepValid(formStep) || formStep > 4}
							onClick={() => setFormStep((prev) => prev + 1)}
							key={formStep}
						>
							{formStep === 4
								? form.watch("invitees").length === 0
									? "Skip & Finish"
									: "Invite & Finish"
								: "Next"}
							<ChevronRight className="ml-2 h-4 w-4" />
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default CreateProjectForm;
