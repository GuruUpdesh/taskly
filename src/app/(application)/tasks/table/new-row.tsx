"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, ChevronRight, Plus, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

// ui
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { NewTask, Task, insertTaskSchema } from "~/server/db/schema";
import DataTableRow from "./data-table-row";
import { OptimisticActions } from "./task-table";
import { useChat } from "ai/react";

type NewRowProps = {
	optimisticActions: OptimisticActions;
};

const defaultValues: NewTask = {
	title: "",
	description: "",
	status: "todo",
	priority: "medium",
	type: "task",
};

const NewRow = ({ optimisticActions }: NewRowProps) => {
	const [showForm, setShowForm] = useState(false);
	const [showAiForm, setShowAiForm] = useState(false);

	function handleClick(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) {
		if (event.ctrlKey) {
			setShowAiForm(true);
		} else {
			setShowForm(true);
		}
	}

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

	type AiTask = { [K in keyof Omit<Task, "id">]?: Task[K] };
	const [aiResponse, setAiResponse] = useState(false);
	const [taskObject, setTaskObject] = useState<AiTask | null>(null);
	useEffect(() => {
		console.log(messages);
		const filtered = messages.filter((m) => m.role === "assistant");
		if (filtered.length === 0) return;
		setAiResponse(true);
		if (!filtered[0]) return;

		const taskObject = extractValidJson(filtered[0].content.toLowerCase()) as AiTask;
		console.log(taskObject);
		if (taskObject) {
			setTaskObject(taskObject);
		}
	}, [messages]);

	if (showForm) {
		return (
			<>
				<DataTableRow
					variant="new"
					task={{ ...defaultValues, id: Math.random() }}
					optimisticActions={optimisticActions}
					closeForm={() => setShowForm(false)}
				/>
				<TableRow className="pointer-events-none opacity-50">
					<TableCell className="p-0" colSpan={6}>
						<Button variant="ghost"></Button>
					</TableCell>
				</TableRow>
			</>
		);
	}

	if (showAiForm) {
		return (
			<>
				<DataTableRow
					variant="ai"
					task={{
						...defaultValues,
						...taskObject,
						id: Math.random(),
					}}
					optimisticActions={optimisticActions}
				/>

				<TableRow>
					<TableCell className="p-0" colSpan={6}>
						<form
							className="flex"
							id="chat"
							onSubmit={handleSubmit}
						>
							<span className="flex items-center gap-1 bg-muted p-1 px-4">
								<Bot className="h-4 w-4" />
							</span>
							<Input
								className="border-none"
								name="description"
								id="description"
								placeholder="Describe a task and TaskerBot will create it..."
								value={input}
								onChange={handleInputChange}
							/>
							<div className="absolute right-[1px]">
								<Button
									onClick={() => setShowAiForm(false)}
									size="icon"
									variant="ghost"
									className="mr-2 border-l"
								>
									<X className="h-4 w-4" />
								</Button>
								<Button type="submit" size="icon">
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						</form>
					</TableCell>
				</TableRow>
			</>
		);
	}

	return (
		<TableRow>
			<TableCell className="p-0" colSpan={6}>
				<Button
					variant="ghost"
					className="flex w-full justify-start opacity-50 "
					onClick={handleClick}
				>
					<Plus className="mr-2 h-4 w-4" /> New
					<span className=" ml-4 flex items-center gap-1 bg-muted p-1 px-4">
						<Bot className="h-4 w-4" />
						Hold Ctrl for AI
					</span>
				</Button>
			</TableCell>
		</TableRow>
	);
};

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

export default NewRow;
