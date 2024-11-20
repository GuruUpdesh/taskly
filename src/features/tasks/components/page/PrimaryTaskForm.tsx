"use client";

import React, { useCallback, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import type { UseMutationResult } from "@tanstack/react-query";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import _debounce from "lodash/debounce";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "~/components/ui/input";
import { type getPRStatusFromGithubRepo } from "~/features/github-integration/actions/get-pr-status-from-github-repo";
import { type UpdateTask } from "~/features/tasks/components/backlog/TasksContainer";
import BubbleMenu from "~/features/text-editor/components/BubbleMenu";
import RenderMentionOptions from "~/features/text-editor/components/RenderMentionOptions";
import extensions from "~/features/text-editor/extensions";
import type { NewTask, Task } from "~/schema";
import { useRealtimeStore } from "~/store/realtime";

import { type TaskHistoryWithUser } from "../HistoryItem";
import "~/features/text-editor/tiptap.css";

interface TaskWithComments extends Task {
	taskHistory: TaskHistoryWithUser[];
}

type Props = {
	task: TaskWithComments;
	editTaskMutation: UseMutationResult<void, Error, UpdateTask, unknown>;
	pullRequests?: Awaited<ReturnType<typeof getPRStatusFromGithubRepo>>;
};

const insertTaskSchema__Primary = z.object({
	title: z.string(),
	description: z.string(),
});

type FormType = Pick<NewTask, "title" | "description">;

const PrimaryTaskForm = ({ task, editTaskMutation }: Props) => {
	const form = useForm<FormType>({
		resolver: zodResolver(insertTaskSchema__Primary),
		mode: "onChange",
		defaultValues: {
			title: task.title,
			description: task.description,
		},
	});

	useEffect(() => {
		form.reset({
			title: task.title,
			description: task.description,
		});
	}, [JSON.stringify(task)]);

	function onSubmit(updatedTask: FormType) {
		editTaskMutation.mutate({
			id: task.id,
			newTask: {
				...updatedTask,
				sprintId: String(task.sprintId),
			},
		});
	}

	async function handleChange() {
		const isValid = await form.trigger();
		if (isValid) {
			await form.handleSubmit(onSubmit)();
		}
	}

	const debouncedHandleChange = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		_debounce(handleChange, 1000) as () => void,
		[],
	);

	const assignees = useRealtimeStore((state) => state.assignees);
	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			...extensions,
			Placeholder.configure({
				placeholder: "Add a description...",
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
		content: form.watch("description"),
		onUpdate: (e) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			const content = e.editor.storage.markdown.getMarkdown();
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			form.setValue("description", content);
			debouncedHandleChange();
		},
	});

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className="mx-auto flex w-[600px] max-w-full flex-grow flex-col gap-2 pb-4 pt-2"
		>
			<Input
				type="text"
				className="m-0 border-none bg-transparent p-0 py-2 text-2xl font-medium ring-offset-transparent focus-visible:ring-transparent"
				placeholder="Task Title"
				autoFocus
				autoComplete="off"
				{...form.register("title")}
				onChangeCapture={debouncedHandleChange}
			/>
			<div>
				{editor && <BubbleMenu editor={editor} />}
				<EditorContent editor={editor} />
			</div>
		</form>
	);
};

export default PrimaryTaskForm;
