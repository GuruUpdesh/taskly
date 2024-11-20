import React, { useState, type KeyboardEvent } from "react";

import { X } from "lucide-react";
import { z } from "zod";

import { Input } from "~/components/ui/input";

type Props = {
	setInvitees: (invitees: string[]) => void;
	placeholder?: string;
	autoFocus?: boolean;
};

const EmailInviteForm = ({
	setInvitees,
	placeholder = "Type an email and press Enter",
	autoFocus = false,
}: Props) => {
	const [inputValue, setInputValue] = useState("");
	const [emails, setEmails] = useState<string[]>([]);

	const isValidEmail = (email: string) => {
		return z.string().email().safeParse(email).success;
	};

	const addEmails = (emailsToAdd: string[]) => {
		const validNewEmails = emailsToAdd
			.map((email) => email.trim())
			.filter(
				(email) =>
					email && isValidEmail(email) && !emails.includes(email),
			);

		if (validNewEmails.length) {
			const newEmails = [...emails, ...validNewEmails];
			setEmails(newEmails);
			setInvitees(newEmails);
			setInputValue("");
		}
	};

	const removeEmail = (emailToRemove: string) => {
		const newEmails = emails.filter((email) => email !== emailToRemove);
		setEmails(newEmails);
		setInvitees(newEmails);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addEmails([inputValue]);
		}
		// Also handle comma for convenience
		if (e.key === ",") {
			e.preventDefault();
			addEmails([inputValue]);
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const pastedText = e.clipboardData.getData("text");

		// Split by commas or newlines
		const pastedEmails = pastedText
			.split(/[,\n]/)
			.map((email) => email.trim())
			.filter(Boolean);

		addEmails(pastedEmails);
	};

	return (
		<div className="w-full space-y-2">
			<Input
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
				onPaste={handlePaste}
				placeholder={placeholder}
				className="w-full rounded-md border bg-accent/50 px-4 py-2"
				autoComplete="off"
				autoFocus={autoFocus}
			/>
			{inputValue && !isValidEmail(inputValue) && (
				<p className="text-sm text-red-500">
					Please enter a valid email address
				</p>
			)}
			<div className="flex flex-wrap gap-2">
				{emails.map((email) => (
					<div
						key={email}
						className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-sm"
					>
						<span>{email}</span>
						<button
							onClick={() => removeEmail(email)}
							className="ml-1 rounded-full p-0.5 hover:bg-accent-foreground/10"
						>
							<X className="h-3 w-3" />
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default EmailInviteForm;
