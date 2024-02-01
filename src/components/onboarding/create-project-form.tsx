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
		console.log(result);
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

	// invitees
	const [currentInvitee, setCurrentInvitee] = useState("");
	function handleInviteesChange(e: React.ChangeEvent<HTMLInputElement>) {
		setCurrentInvitee(e.target.value);
	}
	const [focusedChip, setFocusedChip] = useState<number | null>(null);
	useEffect(() => {
		if (focusedChip !== null && chipRefs?.[focusedChip]?.current) {
			chipRefs?.[focusedChip]?.current?.focus();
		} else if (focusedChip === null && inviteesInputRef.current) {
			inviteesInputRef.current.focus();
		}
	}, [focusedChip]);

	const chipRefs = watch("invitees").map(() =>
		React.createRef<HTMLDivElement>(),
	);
	const inviteesInputRef = React.useRef<HTMLInputElement>(null);

	function handleNewInvitee() {
		const result = z
			.string()
			.email()
			.safeParse(currentInvitee.replace(",", "").trim());
		if (!result.success) {
			const errors = result.error.flatten();
			console.log(errors);
			const messages = errors.formErrors.join(", ");
			toast.error(messages);
			return;
		}

		const invitees = watch("invitees");
		setValue("invitees", [...invitees, result.data]);
		setCurrentInvitee("");
	}

	function handleInviteesKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter") {
			handleNewInvitee();
		}
		if (e.key === "Backspace") {
			if (currentInvitee === "") {
				e.preventDefault();
				if (focusedChip !== null) {
					setValue(
						"invitees",
						watch("invitees").filter((_, i) => i !== focusedChip),
					);
					setFocusedChip(null);
				} else if (watch("invitees").length > 0) {
					setFocusedChip(watch("invitees").length - 1);
				}
			}
		}
	}

	useEffect(() => {
		if (currentInvitee.includes(",") || currentInvitee.includes(" ")) {
			handleNewInvitee();
		}
	}, [currentInvitee]);

	function handleChipClick(index: number) {
		setValue(
			"invitees",
			watch("invitees").filter((_, i) => i !== index),
		);
	}

	return (
		<div className="flex flex-col rounded-lg border bg-background/75 p-4 shadow-xl backdrop-blur-lg">
			<div className="text-center">
				<h1 className="text-2xl tracking-tight">Create a Project</h1>
				<span className="absolute right-2 top-2 text-sm text-muted-foreground">
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
				{formStep === 2 && (
					<div className="flex min-h-[42px] max-w-full flex-wrap items-center gap-1 py-2">
						{watch("invitees").map((invitee, index) => (
							<Chip
								key={index}
								ref={chipRefs[index]}
								onClick={() => handleChipClick(index)}
								keyDown={handleInviteesKeyDown}
								onBlur={() => setFocusedChip(null)}
								isFocused={index === focusedChip}
							>
								{invitee}
							</Chip>
						))}
						{watch("invitees").length === 0 &&
							"You can do this later."}
					</div>
				)}
				<Input
					ref={inviteesInputRef}
					placeholder={`Invite your team to "${watch("name")}" by email`}
					className={cn(
						"mb-4 w-full rounded-md border px-4 py-2",
						formStep !== 2 && "hidden",
					)}
					hidden={formStep !== 2}
					onChange={handleInviteesChange}
					value={currentInvitee}
					autoFocus
					autoComplete="off"
					onKeyDown={handleInviteesKeyDown}
					key={formStep}
				/>
				<div className="flex justify-between gap-2">
					{formStep > 1 ? (
						<Button
							type="button"
							variant="outline"
							disabled={!isValid}
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
							(formStep === 1 && !isProjectNameAvailable)
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

const Chip = React.forwardRef<
	HTMLDivElement,
	{
		children: string;
		onClick: () => void;
		keyDown: (e: React.KeyboardEvent) => void;
		onBlur: () => void;
		isFocused: boolean;
	}
>(function Chip({ children, onClick, keyDown, onBlur, isFocused }, ref) {
	return (
		<div
			ref={ref}
			onClick={onClick}
			className={cn(
				"relative flex items-center gap-2 rounded-full border bg-background px-2 pr-8 hover:bg-accent/50",
				isFocused && "ring ring-accent/50",
			)}
			onKeyDown={keyDown}
			onBlur={onBlur}
			tabIndex={-1}
		>
			{children}
			<CrossCircledIcon className="absolute right-2 top-0 aspect-square h-full" />
		</div>
	);
});

export default CreateProjectForm;
