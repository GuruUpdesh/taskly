import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Loader2Icon, MessageSquareIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useAppStore } from "~/store/app";

import TextAreaWithMentions from "./TextAreaWithMentions";
import { Button } from "../../ui/button";
import { Form, FormControl, FormField, FormItem } from "../../ui/form";

type Props = {
	taskId: number;
	createComment: (comment: string, taskId: number) => Promise<void>;
};

const formSchema = z.object({
	comment: z.string().min(1).max(3000),
});

const CommentForm = ({ taskId, createComment }: Props) => {
	const assignees = useAppStore((state) => state.assignees);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			comment: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await createComment(values.comment, taskId);
		form.reset();
		toast.success("Comment added", {
			icon: <MessageSquareIcon className="h-4 w-4" />,
		});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="sticky bottom-0 w-full"
			>
				<div className="pointer-events-none absolute -bottom-1 left-0 -z-10 h-[135%] w-full bg-gradient-to-b from-transparent to-[#1b1b1b] to-25%" />
				<FormField
					control={form.control}
					name="comment"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<TextAreaWithMentions
									assignees={assignees}
									field={field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button
					className="absolute bottom-1.5 right-1.5 text-xs"
					variant="secondary"
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
