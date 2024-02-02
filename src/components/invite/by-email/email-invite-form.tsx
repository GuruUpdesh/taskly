import React, { useEffect, useState, createRef, useRef } from "react";
import { toast } from "sonner";
import { z } from "zod";
import Chip from "./email-chip";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

type Props = {
	invitees: string[];
	setInvitees: (invitees: string[]) => void;
	chipPlaceholder?: string;
	projectName?: string;
	visible?: boolean;
};

const EmailInviteForm = ({
	invitees,
	setInvitees,
	chipPlaceholder = "Invite your team by email",
	projectName = "this project",
	visible = true,
}: Props) => {
	const [currentInvitee, setCurrentInvitee] = useState("");

	function validateEmail(email: string) {
		const trimmedEmail = email.replace(",", "").trim();

		const result = z.string().email().safeParse(trimmedEmail);

		if (!result.success) {
			const errors = result.error.flatten();
			const messages = errors.formErrors.join(", ");
			toast.error(messages);
			return "";
		}

		return trimmedEmail;
	}

	function handleNewInvitee() {
		const validatedEmail = validateEmail(currentInvitee);
		if (validatedEmail === "") return;

		setInvitees([...invitees, validatedEmail]);
		setCurrentInvitee("");
	}

	// form
	const inviteesInputRef = useRef<HTMLInputElement>(null);
	function handleInviteeChange(e: React.ChangeEvent<HTMLInputElement>) {
		setCurrentInvitee(e.target.value);
	}

	function handleInviteesKeyDown(e: React.KeyboardEvent) {
		const focusedElementIndex = chipRefs.findIndex(
			(ref) => ref.current === document.activeElement,
		);

		switch (e.key) {
			case "Enter":
				e.preventDefault();
				handleNewInvitee();
				break;
			case "Backspace":
				if (currentInvitee === "") {
					e.preventDefault();
					if (focusedElementIndex !== -1) {
						// Remove the focused chip
						setInvitees(
							invitees.filter(
								(_, i) => i !== focusedElementIndex,
							),
						);
						// Focus the previous chip or the input if there's no previous chip
						if (focusedElementIndex > 0) {
							chipRefs[focusedElementIndex - 1]?.current?.focus();
						} else {
							inviteesInputRef.current?.focus();
						}
					} else if (invitees.length > 0) {
						// Focus the last chip
						chipRefs[invitees.length - 1]?.current?.focus();
					}
				}
				break;
			case "ArrowLeft":
				if (focusedElementIndex > 0) {
					// Focus the previous chip
					chipRefs[focusedElementIndex - 1]?.current?.focus();
				} else if (focusedElementIndex === 0) {
					// If the first chip is focused, focus the input
					inviteesInputRef.current?.focus();
				}
				break;
			case "ArrowRight":
				if (
					focusedElementIndex !== -1 &&
					focusedElementIndex < invitees.length - 1
				) {
					// Focus the next chip
					chipRefs[focusedElementIndex + 1]?.current?.focus();
				} else if (focusedElementIndex === invitees.length - 1) {
					// If the last chip is focused, focus the input
					inviteesInputRef.current?.focus();
				}
				break;
			default:
				break;
		}
	}

	useEffect(() => {
		if (currentInvitee.includes(",") || currentInvitee.includes(" ")) {
			handleNewInvitee();
		}
	}, [currentInvitee]);

	// chips
	const [focusedChip, setFocusedChip] = useState<number | null>(null);

	useEffect(() => {
		if (focusedChip !== null) {
			// focus on the chip
			chipRefs?.[focusedChip]?.current?.focus();
		} else if (focusedChip === null && invitees.length === 0) {
			// focus on the chip input
			inviteesInputRef?.current?.focus();
		} else if (invitees.length > 0) {
			setFocusedChip(invitees.length - 1);
		}
	}, [focusedChip]);

	const chipRefs = invitees.map(() => createRef<HTMLDivElement>());

	function handleChipClick(index: number) {
		setInvitees(invitees.filter((_, i) => i !== index));
	}

	return (
		<>
			{visible ? (
				<div className="flex min-h-[42px] max-w-full flex-wrap items-center gap-1 py-2">
					{invitees.map((invitee, index) => (
						<Chip
							key={index}
							ref={chipRefs[index]}
							onClick={() => handleChipClick(index)}
							isFocused={index === focusedChip}
							keyDown={handleInviteesKeyDown}
							onBlur={() => setFocusedChip(null)}
						>
							{invitee}
						</Chip>
					))}
					{invitees.length === 0 && chipPlaceholder}
				</div>
			) : null}
			<Input
				ref={inviteesInputRef}
				placeholder={`Invite your team to "${projectName}" by email`}
				onChange={handleInviteeChange}
				value={currentInvitee}
				onKeyDown={handleInviteesKeyDown}
				className={cn(
					"w-full rounded-md border px-4 py-2",
					!visible ? "hidden" : "",
				)}
				autoFocus
				hidden={!visible}
				autoComplete="off"
			/>
		</>
	);
};

export default EmailInviteForm;
