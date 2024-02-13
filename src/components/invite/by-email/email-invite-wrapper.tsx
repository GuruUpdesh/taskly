"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useNavigationStore } from "~/store/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import EmailInviteForm from "./email-invite-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { sendEmailInvites } from "~/actions/invite-actions";
import { Loader2 } from "lucide-react";

type Props = {
	projectId: string;
};

const EmailInviteWrapper = ({ projectId }: Props) => {
	const EmailInviteFormSchema = z.object({
		invitees: z.array(z.string().email()),
	});

	const project = useNavigationStore((state) => state.currentProject);

	const form = useForm<z.infer<typeof EmailInviteFormSchema>>({
		mode: "onChange",
		resolver: zodResolver(EmailInviteFormSchema),
		defaultValues: {
			invitees: [],
		},
	});

	const [isLoading, startTransition] = useTransition();
	async function onSubmit(formData: z.infer<typeof EmailInviteFormSchema>) {
		const result = await sendEmailInvites(
			parseInt(projectId),
			formData.invitees,
			project?.name,
		);

		if (result.status) {
			toast.success(result.message);
			form.reset({
				invitees: [],
			});
		} else {
			toast.error(result.message);
		}
	}

	if (!project) {
		toast.error("Project not found");
		return null;
	}

	return (
		<form className="flex flex-col pt-4">
			<p className="text-muted-foreground">
				Invite a user using their email below!
			</p>
		  <div className="flex items-center"> {/* Added flex class and items-center */}
			<EmailInviteForm
			  invitees={form.watch("invitees").join(", ")}
			  setInvitees={(invitees) => form.setValue("invitees", invitees)}
			/>
			<Button
			  disabled={form.watch("invitees").length === 0 || isLoading}
			  onClick={() => startTransition(form.handleSubmit(onSubmit))}
			  className="gap-2 ml-2" // Added ml-2 for left margin
			>
			  {isLoading ? "Sending invites..." : "Invite"}
			  {isLoading ? (
				<Loader2 className="ml-2 h-4 w-4 animate-spin" />
			  ) : null}
			</Button>
		  </div>
		</form>
	  );
	  
	  
};

export default EmailInviteWrapper;
