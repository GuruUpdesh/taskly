"use client";

import React, { useState, useEffect } from "react";

import { Cross2Icon, ReloadIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { endOfDay, startOfDay } from "date-fns";
import { ChevronRight, Loader2, SparklesIcon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { type UpdateTask } from "~/app/(application)/project/[projectId]/(views)/components/TasksContainer";
import SimpleTooltip from "~/app/components/SimpleTooltip";
import Task from "~/app/components/task/Task";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { type StatefulTask } from "~/config/taskConfigType";
import { type User } from "~/server/db/schema";
import { useRealtimeStore } from "~/store/realtime";

const exampleTasks = [
	{
		id: 1,
		title: "Redesign Homepage Banner",
		description:
			"Create a more engaging and visually appealing homepage banner.",
		status: "todo",
		points: "3",
		priority: "high",
		type: "task",
		assignee: "Alex Smith",
		boardOrder: 1,
		backlogOrder: 1,
		sprintId: 1,
		lastEditedAt: new Date("2024-04-15"),
		insertedDate: new Date("2024-04-10"),
		projectId: 1,
		branchName: "redesign-homepage-banner",
		options: {},
	},
	{
		id: 2,
		title: "Improve Mobile Responsiveness",
		description:
			"Ensure the homepage provides a seamless experience on mobile devices.",
		status: "todo",
		points: "2",
		priority: "medium",
		type: "improvement",
		assignee: "Casey Johnson",
		boardOrder: 2,
		backlogOrder: 2,
		sprintId: 1,
		lastEditedAt: new Date("2024-04-16"),
		insertedDate: new Date("2024-04-10"),
		projectId: 1,
		branchName: "mobile-responsiveness",
		options: {},
	},
	{
		id: 3,
		title: "Optimize Homepage Loading Speed",
		description:
			"Compress images and refine scripts to improve the homepage's loading speed.",
		status: "todo",
		points: "3",
		priority: "high",
		type: "task",
		assignee: "Jordan Lee",
		boardOrder: 3,
		backlogOrder: 3,
		sprintId: 1,
		lastEditedAt: new Date("2024-04-17").toISOString(),
		insertedDate: new Date("2024-04-10").toISOString(),
		projectId: 1,
		branchName: "optimize-loading-speed",
		options: {},
	},
] as StatefulTask[];

const exampleAssignees = [
	{
		userId: "1",
		username: "Alex Smith",
		profilePicture: "/static/profiles/p1.png",
	},
	{
		userId: "2",
		username: "Casey Johnson",
		profilePicture: "/static/profiles/p2.png",
	},
	{
		userId: "3",
		username: "Jordan Lee",
		profilePicture: "/static/profiles/p3.png",
	},
] as User[];

const exampleSprints = [
	{
		name: "Sprint 1",
		id: 1,
		projectId: 1,
		startDate: startOfDay(new Date()),
		endDate: endOfDay(new Date()),
	},
];

const AiTaskCreationPanel = () => {
	const [tasks, setTasks] = useState<StatefulTask[]>(exampleTasks);
	const [value, setValue] = useState("");
	const [isHovered, setIsHovered] = useState(false);
	const promptText = "Create 3 tasks for improving homepage styles.";
	const [showCursor, setShowCursor] = useState(true);
	const cursorSymbol = "|";
	const [typingComplete, setTypingComplete] = useState(false);
	const [showResults, setShowResults] = useState(false);

	useEffect(() => {
		if (isHovered && value.length < promptText.length) {
			const timeoutId = setTimeout(() => {
				const newValue = promptText.substring(0, value.length + 1);
				setValue(newValue);
				if (newValue.length === promptText.length) {
					setTypingComplete(true);
				}
			}, 30);
			return () => clearTimeout(timeoutId);
		}
	}, [value, isHovered, promptText]);

	useEffect(() => {
		const cursorInterval = setInterval(() => {
			setShowCursor((show) => !show);
		}, 500);
		return () => clearInterval(cursorInterval);
	}, []);

	useEffect(() => {
		if (!typingComplete) return;
		const resultTimer = setTimeout(() => {
			setShowResults(true);
		}, 500);
		return () => clearTimeout(resultTimer);
	}, [typingComplete]);

	const [updateAssignees, updateSprints] = useRealtimeStore(
		useShallow((state) => [state.updateAssignees, state.updateSprints]),
	);

	useEffect(() => {
		updateAssignees(exampleAssignees);
		updateSprints(exampleSprints);
	}, []);

	const editTaskMutation = useMutation({
		// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
		mutationFn: async ({ id, newTask }: UpdateTask) => {},
		onMutate: ({ id, newTask }: UpdateTask) => {
			const old = [...tasks];
			const newTasks =
				old?.map((task) =>
					task.id === id
						? {
								...task,
								...newTask,
							}
						: task,
				) ?? [];
			setTasks(newTasks as StatefulTask[]);
			return { old };
		},
	});

	const deleteTaskMutation = useMutation({
		// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
		mutationFn: async (id: number) => {},
		onMutate: (id: number) => {
			const old = [...tasks];
			const newTasks = old?.filter((task) => task.id !== id) ?? [];
			setTasks(newTasks);
			return { old };
		},
	});

	return (
		<div>
			<div
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => {
					setIsHovered(false);
					setValue("");
					setTypingComplete(false);
					setShowResults(false);
				}}
				className="group absolute z-10 flex h-full w-full flex-col items-center justify-center bg-background/75 opacity-0 backdrop-blur-xl transition-opacity hover:opacity-100"
			>
				{!showResults ? (
					<Card className="fadeInUp hidden w-[400px] border-foreground/10 bg-accent/50 p-2 shadow-lg group-hover:block">
						<CardContent className="px-2 py-1">
							<CardHeader className="mb-4 p-0">
								<div className="flex items-center justify-between">
									<CardTitle className="text-md flex items-center gap-2">
										<SparklesIcon className="h-4 w-4" />
										Create Tasks
									</CardTitle>
									<Cross2Icon className="h-4 w-4 opacity-25" />
								</div>
							</CardHeader>
							<CardContent className="mb-4 p-0">
								<Textarea
									value={
										isHovered
											? `${value}${showCursor ? cursorSymbol : ""}`
											: value
									}
									placeholder="Describe the task you would like to create..."
									className="pointer-events-none h-[80px] resize-none border-foreground/25 !bg-transparent"
									readOnly
								/>
							</CardContent>
							<CardFooter className="gap-2 p-0">
								<div className="flex-1" />
								<Button
									size="sm"
									type="button"
									variant="outline"
									className="bg-transparent text-xs"
								>
									Close
								</Button>
								<Button
									size="sm"
									variant="secondary"
									className="flex items-center gap-2 text-xs"
								>
									{typingComplete ? "Submitting" : "Submit"}
									{typingComplete ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<ChevronRight className="h-4 w-4" />
									)}
								</Button>
							</CardFooter>
						</CardContent>
					</Card>
				) : (
					<div className="staggered-children flex w-[400px] flex-col gap-2">
						{tasks.map((task, index) => (
							<div
								key={index}
								className="shadow-lg"
								style={
									{
										"--child-index": index,
									} as React.CSSProperties
								}
							>
								<Task
									task={task}
									addTaskMutation={editTaskMutation}
									deleteTaskMutation={deleteTaskMutation}
									variant="board"
									projectId="1"
									disableNavigation
								/>
							</div>
						))}
						<SimpleTooltip label="Reset">
							<Button
								variant="secondary"
								size="icon"
								className="my-1"
								onClick={() => {
									setIsHovered(false);
									setValue("");
									setTypingComplete(false);
									setShowResults(false);
								}}
							>
								<ReloadIcon className="transition-all" />
							</Button>
						</SimpleTooltip>
					</div>
				)}
			</div>
		</div>
	);
};

export default AiTaskCreationPanel;
