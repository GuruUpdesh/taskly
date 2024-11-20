"use client";

import React, { useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { sendEmailInvites } from "~/features/invite/actions/invite-actions";
import { useRealtimeStore } from "~/store/realtime";

import EmailInviteForm from "./email-invite-form";

type Props = {
	projectId: number;
};

const EmailInviteWrapper = ({ projectId }: Props) => {
	const EmailInviteFormSchema = z.object({
		invitees: z.array(z.string().email()),
	});

	const project = useRealtimeStore((state) => state.project);

	const form = useForm<z.infer<typeof EmailInviteFormSchema>>({
		mode: "onChange",
		resolver: zodResolver(EmailInviteFormSchema),
		defaultValues: {
			invitees: [],
		},
	});

	const [isLoading, startTransition] = useTransition();
	async function onSubmit(formData: z.infer<typeof EmailInviteFormSchema>) {
		const result = await sendEmailInvites(projectId, formData.invitees);

		if (result.status) {
			toast.success(result.message);
			form.reset({
				invitees: [],
			});
		}
	}

	if (!project) {
		return null;
	}

	return (
		<form className="flex w-full flex-col gap-4">
			<EmailInviteForm
				setInvitees={(invitees) => form.setValue("invitees", invitees)}
			/>
			<Button
				variant="secondary"
				disabled={form.watch("invitees").length === 0 || isLoading}
				onClick={() => startTransition(form.handleSubmit(onSubmit))}
				className="ml-2 gap-2" // Added ml-2 for left margin
				size="sm"
			>
				{isLoading ? "Sending invites..." : "Invite"}
				{isLoading ? (
					<Loader2 className="ml-2 h-4 w-4 animate-spin" />
				) : (
					<ChevronRight className="h-4 w-4" />
				)}
			</Button>
		</form>
	);
};

export default EmailInviteWrapper;
