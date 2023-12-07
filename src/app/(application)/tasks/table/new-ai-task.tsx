import { useChat } from "ai/react";
import React, { useEffect, useState } from "react";
import { insertTaskSchema, type NewTask, type Task } from "~/server/db/schema";
import { type OptimisticActions } from "./task-table";
import { TableCell, TableRow } from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { Bot, ChevronRight, X } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

type Props = {
	optimisticActions: OptimisticActions;
	closeForm: () => void;
};

const NewAiTask = ({ optimisticActions, closeForm }: Props) => {
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

	useEffect(() => {
		return () => {
			stop();
			setMessages([]);
		};
	}, []);

	type AiTask = { [K in keyof Omit<Task, "id">]?: Task[K] };
	const [taskObject, setTaskObject] = useState<AiTask | null>(null);
	useEffect(() => {
		const filtered = messages.filter((m) => m.role === "assistant");
		if (filtered.length === 0) return;
		if (!filtered[0]) return;

		const taskObject = extractValidJson(
			filtered[0].content.toLowerCase(),
		) as AiTask;

		if (taskObject) {
			setTaskObject(taskObject);
			if (insertTaskSchema.safeParse(taskObject).success === true) {
				void optimisticActions.createTask(taskObject as NewTask);
				stop();
				setMessages([]);
				closeForm();
			}
		}
	}, [messages]);

	return (
		<>
			<TableRow className="bg-background">
				<TableCell className="p-0" colSpan={6}>
					<div className="flex">
						<span
							className={cn(
								"flex items-center justify-center gap-1 bg-muted p-1 px-4",
								{
									grow:
										isLoading ||
										insertTaskSchema.safeParse(taskObject)
											.success === true,
									"bg-blue-500":
										insertTaskSchema.safeParse(taskObject)
											.success === true,
								},
							)}
						>
							<Bot
								className={cn("h-4 w-4", {
									"animate-bounce": isLoading,
								})}
							/>
						</span>
						<form
							className={cn("flex", {
								"max-w-0 overflow-hidden":
									isLoading ||
									insertTaskSchema.safeParse(taskObject)
										.success === true,
								grow: !isLoading,
							})}
							id="chat"
							onSubmit={(e) => {
								handleSubmit(e);
							}}
						>
							<Input
								className="w-[500px] border-none"
								name="description"
								id="description"
								placeholder="Describe a task and TaskerBot will create it..."
								value={input}
								onChange={handleInputChange}
							/>
							<Button
								onClick={closeForm}
								variant="ghost"
								className="border-l"
							>
								<X className="h-4 w-4" />
							</Button>
							<Button type="submit">
								Submit
								<ChevronRight className="ml-2 h-4 w-4" />
							</Button>
						</form>
					</div>
				</TableCell>
			</TableRow>
		</>
	);
};

export default NewAiTask;

function extractValidJson(data: string): unknown {
	// Check if the last character is a closing brace
	if (data.endsWith("}")) {
		try {
			return JSON.parse(data);
		} catch (e) {
			console.error("JSON Error:", e);
			return null;
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
	} catch (e) {
		console.error("JSON Error:", e);
		return null;
	}
}
