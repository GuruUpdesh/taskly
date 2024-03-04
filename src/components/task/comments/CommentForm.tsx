import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createComment } from "~/actions/application/comment-actions";

import { Button } from "../../ui/button";
import { Form, FormControl, FormField, FormItem } from "../../ui/form";
import { Textarea } from "../../ui/textarea";

type Props = {
	taskId: number;
};

const formSchema = z.object({
	comment: z.string().min(1).max(3000),
});

const CommentForm = ({ taskId }: Props) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			comment: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await createComment(values.comment, taskId);
		form.reset();
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="sticky bottom-0 grid w-full items-center gap-1.5"
			>
				<div className="pointer-events-none absolute -bottom-1 left-0 -z-10 h-[135%] w-full bg-gradient-to-b from-transparent to-[#081020] to-25%" />
				<FormField
					control={form.control}
					name="comment"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Textarea
									placeholder="Add a comment..."
									className="resize-none bg-accent/25"
									rows={2}
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button
					className="absolute bottom-1.5 right-1.5 text-xs"
					size="sm"
					disabled={
						!form.formState.isDirty || form.formState.isSubmitting
					}
				>
					{form.formState.isSubmitting ? "Commenting" : "Comment"}
					{form.formState.isSubmitting ? (
						<Loader2Icon className="ml-2 h-3 w-3 animate-spin" />
					) : (
						<ChevronRight className="ml-2 h-3 w-3" />
					)}
				</Button>
			</form>
		</Form>
	);
};

export default CommentForm;