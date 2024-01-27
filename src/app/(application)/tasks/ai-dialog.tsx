"use client";

import React, { useEffect, useTransition, useState, useRef } from "react";
import { useChat } from "ai/react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Bot, ChevronRight, Loader2 } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { type Task, selectTaskSchema } from "~/server/db/schema";
import { createTask } from "~/actions/task-actions";
import { throwClientError } from "~/utils/errors";

type AiTask = { [K in keyof Omit<Task, "id">]?: Task[K] };

type Props = {
	dispatch: (action: { type: "ADD" | "DELETE"; payload: Task }) => void;
};

function extractValidJson(data: string): unknown {
	// Check if the last character is a closing brace
	if (data.endsWith("}")) {
		try {
			return JSON.parse(data);
		} catch (error) {
			if (error instanceof Error) throwClientError(error.message);
		}
	}

	// Count the number of quotation marks
	const quotes = data.match(/"/g) ?? [];
	if (quotes.length < 4) {
		return null; // Not enough data to form a valid JSON object
	}

	// Round down to the nearest multiple of 4
	const evenQuotes = quotes.length - (quotes.length % 4);

	// Find the index of the last quotation mark in the even count
	let lastIndex = -1;
	for (let i = 0; i < evenQuotes; i++) {
		lastIndex = data.indexOf('"', lastIndex + 1);
	}

	// Extract the valid substring and trim trailing comma if any
	let validJsonStr = data.substring(0, lastIndex + 1);
	validJsonStr = validJsonStr.replace(/,\s*$/, "") + "}";

	// Parse the valid JSON string
	try {
		return JSON.parse(validJsonStr);
	} catch (error) {
		if (error instanceof Error) throwClientError(error.message);
	}
}

const AiDialog = ({ dispatch }: Props) => {
	const [open, setOpen] = useState(false);
	const {
		messages,
		input,
		isLoading,
		handleInputChange,
		handleSubmit,
		stop,
		setMessages,
	} = useChat({
		api: "/api/chat",
	});

	const formRef = useRef<HTMLFormElement | null>(null);
	const [reviewResponse, setReviewResponse] = useState(false);
	const [taskObject, setTaskObject] = useState<AiTask | null>(null);
	useEffect(() => {
		const filtered = messages.filter((m) => m.role === "assistant");
		if (filtered.length === 0) return;
		setReviewResponse(true);
		if (!filtered[0]) return;

		const taskObject = extractValidJson(filtered[0].content) as AiTask;
		if (taskObject) {
			setTaskObject(taskObject);
		}
	}, [messages]);

	const resetForm = () => {
		if (formRef.current) {
			formRef.current.reset();
		}
		setTaskObject(null);
		setReviewResponse(false);
	};

	const [isPending, startTransition] = useTransition();
	async function handleAccept() {
		try {
			const validatedTask = selectTaskSchema.parse(taskObject);
			dispatch({
				type: "ADD",
				payload: { ...validatedTask, id: Math.random() },
			});
			await createTask(validatedTask);
			setOpen(false);

			// reset state
			setTaskObject(null);
			setReviewResponse(false);
			// clear chat
		} catch (error) {
			if (error instanceof Error) throwClientError(error.message);
		}
	}

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={(open: boolean) => {
					if (!open) {
						stop();
						setMessages([]);
						resetForm();
					}
					setOpen(open);
				}}
			>
				<DialogTrigger asChild>
					<Button
						variant="default"
						size="icon"
						className="rounded-full "
					>
						<Bot className="h-4 w-4" />
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>AI Task Creation</DialogTitle>
						<DialogDescription>
							Describe the task you would like to create, and our
							AI model will create it for you.
						</DialogDescription>
					</DialogHeader>
					<div>
						{taskObject ? (
							<ul>
								{selectTaskSchema.safeParse(taskObject)
									.success === false ? (
									<div className="flex items-center gap-1">
										<p>Creating Task</p>
										<Loader2 className="ml-2 h-4 w-4 animate-spin" />
									</div>
								) : null}
								{taskObject?.title && (
									<li>
										<strong>Title:</strong>{" "}
										{taskObject.title}
									</li>
								)}
								{taskObject?.description && (
									<li>
										<strong>Description:</strong>{" "}
										{taskObject.description}
									</li>
								)}
								{taskObject?.priority && (
									<li>
										<strong>Priority:</strong>{" "}
										{taskObject.priority}
									</li>
								)}
								{taskObject?.status && (
									<li>
										<strong>Status:</strong>{" "}
										{taskObject.status}
									</li>
								)}
								{taskObject?.type && (
									<li>
										<strong>Type:</strong> {taskObject.type}
									</li>
								)}
							</ul>
						) : null}
						{reviewResponse ? (
							<></>
						) : (
							<form
								ref={formRef}
								onSubmit={handleSubmit}
								id="chat"
							>
								<Label htmlFor="description">
									Task Description
								</Label>
								<Textarea
									name="description"
									id="description"
									placeholder="Type your task description here..."
									value={input}
									onChange={handleInputChange}
								/>
							</form>
						)}
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button
								type="button"
								variant="secondary"
								onClick={resetForm}
							>
								Close
							</Button>
						</DialogClose>
						{reviewResponse ? (
							<Button
								type="submit"
								onClick={() =>
									startTransition(() => handleAccept())
								}
								disabled={
									isPending ||
									selectTaskSchema.safeParse(taskObject)
										.success === false
								}
							>
								{isPending ? "Creating" : "Accept Suggestion"}
								{isPending ? (
									<Loader2 className="ml-2 h-4 w-4 animate-spin" />
								) : (
									<ChevronRight className="ml-2 h-4 w-4" />
								)}
							</Button>
						) : (
							<Button
								type="submit"
								form="chat"
								disabled={isLoading}
							>
								{isLoading ? "Submitting" : "Submit"}
								{isLoading ? (
									<Loader2 className="ml-2 h-4 w-4 animate-spin" />
								) : (
									<ChevronRight className="ml-2 h-4 w-4" />
								)}
							</Button>
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default AiDialog;
