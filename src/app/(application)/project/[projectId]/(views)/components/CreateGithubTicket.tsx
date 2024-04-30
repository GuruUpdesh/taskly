"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createTicket } from "~/actions/application/ticket-action";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

const formSchema = z.object({
	title: z.string().max(100),
	description: z.string().max(1000),
});

export function CreateGithubTicket() {
	const [open, setOpen] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
		},
	});

	function resetForm() {
		form.reset({
			title: "",
			description: "",
		});
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const result = await createTicket(values.title, values.description);
		if (result) {
			setOpen(false);
			toast.success("Ticket created successfully!");
		} else {
			toast.error("Failed to create ticket");
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				setOpen(open);
				if (!open) {
					resetForm();
				}
			}}
		>
			<DialogTrigger asChild>
				<div
					style={{
						position: "fixed",
						bottom: "20px",
						right: "20px",
					}}
				>
					<Button
						variant="outline"
						size="icon"
						className="rounded-full"
					>
						<QuestionMarkIcon className="h-4 w-4" />
					</Button>
				</div>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create Issue</DialogTitle>
					<DialogDescription>
						If you are experiencing an issue please create a ticket.
						Click submit to send it to our team!
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form className="grid w-full items-center gap-1.5">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											type="text"
											id="title"
											placeholder="Title"
											className="bg-transparent"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											id="description"
											placeholder="Description"
											className="max-h-200px bg-transparent"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
				<DialogFooter>
					<DialogClose asChild>
						<Button
							type="submit"
							disabled={
								!form.formState.isDirty ||
								form.formState.isSubmitting
							}
							onClick={form.handleSubmit(onSubmit)}
						>
							Submit
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default CreateGithubTicket;
