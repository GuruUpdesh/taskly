"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { CheckCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import {
	type CreateForm,
	createProjectAndInviteUsers,
	getIsProjectNameAvailable,
} from "~/actions/project-actions";
import _debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import EmailInviteForm from "../invite/by-email/email-invite-form";

const CreateProjectSchema = z.object({
	name: z.string().min(3).max(255),
	description: z.string().optional(),
	invitees: z.array(z.string().email()),
});

const CreateProjectForm = () => {
	const router = useRouter();

	const {
		formState: { isValid, errors },
		register,
		watch,
		setError,
		clearErrors,
		handleSubmit,
		reset,
		setValue,
	} = useForm<CreateForm>({
		mode: "onChange",
		resolver: zodResolver(CreateProjectSchema),
		defaultValues: {
			name: "",
			invitees: [],
		},
	});

	async function onSubmit(formData: CreateForm) {
		const result = await createProjectAndInviteUsers(formData);
		if (result.status) {
			toast.success(result.message);
			router.push(`/project/${result.newProjectId}/backlog`);
		} else {
			toast.error(result.message);
			setFormStep(1);
			reset();
			return;
		}

		reset();
	}

	const [formStep, setFormStep] = useState(1);
	useEffect(() => {
		if (formStep === 3) {
			void handleSubmit(onSubmit)();
		}
	}, [formStep]);

	// project name availability check
	const [isProjectNameAvailable, setIsProjectNameAvailable] = useState(false);
	const [isLoading, startTransition] = useTransition();
	async function handleProjectNameChange() {
		if (isValid) {
			const result = await getIsProjectNameAvailable(watch("name"));
			setIsProjectNameAvailable(result);
		}
	}
	const debouncedHandleProjectNameChange = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		_debounce(handleProjectNameChange, 100) as () => void,
		[isValid],
	);
	useEffect(() => {
		if (isValid && !isProjectNameAvailable) {
			setError("name", {
				type: "custom",
				message: "Project name is already taken",
			});
		} else if (isValid && isProjectNameAvailable) {
			clearErrors("name");
		}
	}, [isProjectNameAvailable]);

	return (
		<div className="flex flex-col rounded-lg border bg-background/75 p-4 shadow-xl backdrop-blur-lg">
			<div className="text-center">
				<h1 className="text-2xl tracking-tight">Create a Project</h1>
				<span
					className={cn(
						"absolute right-2 top-2 text-sm text-muted-foreground",
						formStep === 3 && "hidden",
					)}
				>
					Step <b>{formStep}/2</b>
				</span>
				<p className="mb-4 border-b pb-4 text-sm text-muted-foreground">
					Projects are a shared space for your team to collaborate on
					tasks.
				</p>
			</div>
			<form>
				<div
					className={cn("relative mb-8", formStep !== 1 && "hidden")}
				>
					<Input
						id="name"
						type="text"
						{...register("name")}
						placeholder="Project Name"
						className={cn("w-full rounded-md border px-4 py-2")}
						autoFocus
						autoComplete="off"
						hidden={formStep !== 1}
						onChange={(e) => {
							void register("name").onChange(e);
							startTransition(() =>
								debouncedHandleProjectNameChange(),
							);
						}}
					/>
					{errors && errors.name && (
						<p className="absolute translate-y-1 text-sm text-red-500">
							{errors.name.message}
						</p>
					)}
					{watch("name") !== "" && isValid && (
						<span className="absolute right-2 top-[50%] translate-y-[-50%]">
							{isLoading ? (
								<Loader2 className="ml-2 h-4 w-4 animate-spin" />
							) : isProjectNameAvailable ? (
								<CheckCircle className="ml-2 h-4 w-4 text-accent-foreground text-green-500" />
							) : (
								<CrossCircledIcon className="ml-2 h-4 w-4 text-red-500" />
							)}
						</span>
					)}
				</div>
				<Textarea
					{...register("description")}
					placeholder="Describe your project so our system can better provide suggestions (optional)"
					className={cn(
						"mb-4 w-full rounded-md border px-4 py-2",
						formStep !== 1 && "hidden",
					)}
					hidden={formStep !== 1}
				/>
				<div className="mb-4">
					<EmailInviteForm
						invitees={watch("invitees")}
						setInvitees={(invitees) =>
							setValue("invitees", invitees)
						}
						chipPlaceholder="You can do this later."
						projectName={watch("name")}
						visible={formStep === 2}
					/>
				</div>
				{formStep === 3 ? (
					<div className="flex w-full items-center justify-center gap-2">
						<Loader2 className="ml-2 h-4 w-4 animate-spin" />
						Creating project...
					</div>
				) : null}
				<div className="flex justify-between gap-2">
					{formStep > 1 ? (
						<Button
							type="button"
							variant="outline"
							disabled={!isValid || formStep === 3}
							onClick={() => setFormStep((prev) => prev - 1)}
						>
							<ChevronLeft className="mr-2 h-4 w-4" />
							Back
						</Button>
					) : (
						<div className="flex-1" />
					)}
					<Button
						type="button"
						disabled={
							!isValid ||
							(formStep === 1 && !isProjectNameAvailable) ||
							formStep === 3
						}
						onClick={() => setFormStep((prev) => prev + 1)}
						key={formStep}
					>
						{formStep === 2 && watch("invitees").length === 0
							? "Skip"
							: "Next"}
						<ChevronRight className="ml-2 h-4 w-4" />
					</Button>
				</div>
			</form>
		</div>
	);
};

export default CreateProjectForm;
