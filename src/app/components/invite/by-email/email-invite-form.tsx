import React from "react";

import { z } from "zod";

import { Input } from "~/components/ui/input";

type Props = {
	invitees: string;
	setInvitees: (invitees: string[]) => void;
	placeholder?: string;
	autoFocus?: boolean;
};

const EmailInviteForm = ({
	setInvitees,
	placeholder = "Invite your team by email",
	autoFocus = false,
}: Props) => {
	function handleInviteeChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		const emails = value.split(",").map((email) => email.trim());
		const invalid: string[] = [];
		emails.filter((email) => {
			const result = z.string().email().safeParse(email);
			if (!result.success) {
				invalid.push(email);
			}
		});

		setInvitees(emails);
	}

	return (
		<Input
			placeholder={placeholder}
			onChange={handleInviteeChange}
			className="w-full rounded-md border bg-background-dialog px-4 py-2"
			autoComplete="off"
			autoFocus={autoFocus}
		/>
	);
};

export default EmailInviteForm;
