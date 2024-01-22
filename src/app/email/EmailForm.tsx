"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { sendSampleEmailAction } from "../../actions/email-actions";
import { ChevronRight, Loader2 } from "lucide-react";

const EmailForm = () => {
	const emailFormSchema = z.object({
		emailTo: z.string().email(),
		userName: z.string(),
	});

	const form = useForm<z.infer<typeof emailFormSchema>>({
		resolver: zodResolver(emailFormSchema),
		defaultValues: {
			emailTo: "",
			userName: "",
		},
	});

	const [isLoading, setIsLoading] = React.useState(false);

	async function onSubmit(data: z.infer<typeof emailFormSchema>) {
		try {
			setIsLoading(true);
			await sendSampleEmailAction(data.userName, data.emailTo);
			setIsLoading(false);
			form.reset();
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Input
					type="text"
					{...form.register("userName")}
					placeholder="User Name"
				/>
				<p className=" min-h-[1rem] text-xs text-red-500" role="alert">
					{form.formState.errors.userName
						? form.formState.errors.userName.message
						: null}
				</p>
				<Input
					type="text"
					{...form.register("emailTo")}
					placeholder="Email To"
				/>
				<p className=" min-h-[1rem] text-xs text-red-500" role="alert">
					{form.formState.errors.emailTo
						? form.formState.errors.emailTo.message
						: null}
				</p>
				<Button type="submit" disabled={isLoading}>
					Send
					{isLoading ? (
						<Loader2 className="ml-2 h-4 w-4 animate-spin" />
					) : (
						<ChevronRight className="ml-2 h-4 w-4" />
					)}
				</Button>
			</form>
		</>
	);
};

export default EmailForm;
