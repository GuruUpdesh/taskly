import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { ChevronRight, Loader2Icon, MessageSquareIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { useRealtimeStore } from "~/store/realtime";

import BubbleMenu from "../editor/BubbleMenu";
import extensions from "../editor/extensions";
import RenderMentionOptions from "../editor/mentions/RenderMentionOptions";

type Props = {
	taskId: number;
	createComment: (comment: string, taskId: number) => Promise<void>;
};

const formSchema = z.object({
	comment: z.string().min(1).max(3000),
});

const CommentForm = ({ taskId, createComment }: Props) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			comment: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await createComment(values.comment, taskId);
		form.reset();
		editor?.commands.clearContent();
		toast.success("Comment added", {
			icon: <MessageSquareIcon className="h-4 w-4" />,
		});
	}

	const assignees = useRealtimeStore((state) => state.assignees);
	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			...extensions,
			Placeholder.configure({
				placeholder: "Add a comment...",
			}),
			Mention.configure({
				HTMLAttributes: {
					class: "mention",
				},
				suggestion: {
					items: ({ query }) => {
						return assignees
							.filter((user) =>
								user.username
									.toLowerCase()
									.startsWith(query.toLowerCase()),
							)
							.slice(0, 5);
					},
					render: RenderMentionOptions,
				},
			}),
		],
		content: form.watch("comment"),
		onUpdate: (e) => {
			form.setValue("comment", JSON.stringify(e.editor.getJSON()), {
				shouldDirty: true,
				shouldValidate: true,
			});
		},
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="sticky bottom-0 w-full"
			>
				<div className="pointer-events-none absolute -bottom-1 left-0 -z-10 h-[135%] w-full bg-gradient-to-b from-transparent to-background-dialog to-25%" />
				<div className="rounded border bg-background/50 px-3 py-2 ring-offset-background focus-within:outline-none  focus-within:ring focus-within:ring-ring focus-within:ring-offset-1">
					{editor && <BubbleMenu editor={editor} />}
					<EditorContent editor={editor} />
				</div>
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
