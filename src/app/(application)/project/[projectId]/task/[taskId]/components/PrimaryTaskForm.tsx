"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { UseMutationResult } from "@tanstack/react-query";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import _debounce from "lodash/debounce";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { type getPRStatusFromGithubRepo } from "~/actions/application/github-actions";
import { type UpdateTask } from "~/app/(application)/project/[projectId]/(views)/components/TasksContainer";
import SimpleTooltip from "~/app/components/SimpleTooltip";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { NewTask, Task } from "~/server/db/schema";
import { useRealtimeStore } from "~/store/realtime";

import BubbleMenu from "./editor/BubbleMenu";
import extensions from "./editor/extensions";
import RenderMentionOptions from "./editor/mentions/RenderMentionOptions";
import TaskHistoryItem, { type TaskHistoryWithUser } from "./HistoryItem";
import PullRequest from "./PullRequest";
import "../components/editor/tiptap.css";

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

const PrimaryTaskForm = ({ task, editTaskMutation, pullRequests }: Props) => {
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

	const [showAllHistory, setShowAllHistory] = useState(false);

	const displayedHistory = useMemo(
		() =>
			showAllHistory ? task.taskHistory : task.taskHistory.slice(0, 10),

		[task.taskHistory, showAllHistory],
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
			className="mx-auto flex w-[800px] max-w-full flex-grow flex-col gap-2 px-4 pb-4 pt-2"
		>
			<Input
				type="text"
				className="m-0 border-none bg-transparent p-0 py-2 text-2xl ring-offset-transparent focus-visible:ring-transparent"
				placeholder="Task Title"
				autoFocus
				autoComplete="off"
				{...form.register("title")}
				onChangeCapture={debouncedHandleChange}
			/>
			<div className="rounded border p-2">
				{editor && <BubbleMenu editor={editor} />}
				<EditorContent editor={editor} />
			</div>
			<div className="py-4">
				<div className="flex flex-col gap-2 overflow-hidden">
					<h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
						Activity
					</h3>
					<div className="flex flex-col gap-2 pb-2">
						{pullRequests?.map((pr) => {
							return (
								<PullRequest key={pr.number} pullRequest={pr} />
							);
						})}
					</div>
					<div className="flex flex-col gap-4 px-3">
						{displayedHistory.map((history) => {
							return (
								<TaskHistoryItem
									key={history.id}
									history={history}
								/>
							);
						})}
					</div>
					{task.taskHistory.length > 10 && (
						<div className="relative flex w-full justify-center bg-[#101010]">
							<span className="absolute top-[50%] z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-border  to-transparent" />
							<SimpleTooltip
								label={
									showAllHistory ? "Show Less" : "Show All"
								}
							>
								<Button
									size="icon"
									variant="outline"
									onClick={() =>
										setShowAllHistory(!showAllHistory)
									}
									className="z-10 rounded-full bg-[#101010]"
								>
									{showAllHistory ? (
										<ChevronDownIcon className="rotate-180" />
									) : (
										<ChevronDownIcon />
									)}
								</Button>
							</SimpleTooltip>
						</div>
					)}
				</div>
			</div>
		</form>
	);
};

export default PrimaryTaskForm;
