"use client";

// hooks
import React, { useTransition, useOptimistic } from "react";
import { useForm } from "react-hook-form";

// data
import { type Project, type NewProject, insertProjectSchema } from "~/server/db/schema";

// utils
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "~/lib/utils";
import { type VariantProps } from "class-variance-authority";

//ui
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createProject, deleteProject } from "~/actions/projectActions";
import ProjectChip, { type projectChipVariants } from "./ProjectChip";
import {
	ChevronRight,
	Flag,
	Target,
	Loader2,
	Component,
	Trash,
} from "lucide-react";
import { Checkbox } from "../ui/checkbox";

type OptimisticProject = Project & { pending: boolean };

function reducer(
	state: OptimisticProject[],
	action: { type: "ADD" | "DELETE"; payload: Project },
) {
	switch (action.type) {
		case "ADD":
			return [...state, { ...action.payload, pending: true }];
		case "DELETE":
			return state.filter((project) => project.id !== action.payload.id);
		default:
			throw new Error("Invalid action type");
	}
}

type ProjectTableProps = {
	projects: Project[];
};

const ProjectTable = ({ projects }: ProjectTableProps) => {
	const [isLoading, startTransition] = useTransition();
	const [optimisticProject, dispatch] = useOptimistic(
		projects.map((project) => ({ ...project, pending: false })),
		reducer,
	);

	function renderProjectRows() {
		return optimisticProject.map((project) => (
			<TableRow
				key={project.id}
				className={cn({
					"pointer-events-none opacity-50": project.pending,
				})}
			>
				<TableCell className="min-w-[150px]">
					<p className="line-clamp-2 font-semibold tracking-tight">
						{project.name}
					</p>
				</TableCell>
				<TableCell>
					<p className="line-clamp-2 text-muted-foreground">
						{project.description}
					</p>
				</TableCell>
				<TableCell>
					<ProjectChip chipType={getChipType("status", project.status)} />
				</TableCell>
				<TableCell>
					<Button
						onClick={() =>
							startTransition(() => handleDelete(project))
						}
						variant="outline"
						size="icon"
					>
						<Trash className="h-4 w-4" />
					</Button>
				</TableCell>
			</TableRow>
		));
	}

	// options
	const [error, setError] = React.useState(false);

	// form hooks
	const form = useForm<NewProject>({
		resolver: zodResolver(insertProjectSchema),
		defaultValues: {
			name: "",
			description: "",
			status: "active",		
        },
	});

	async function onSubmit(data: NewProject) {
		try {
			dispatch({ type: "ADD", payload: { ...data, id: Math.random() } });
			if (error) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				throw new Error("Something went wrong");
			}
			await createProject(data);
			form.reset();
		} catch (error) {
			console.log(error);
		}
	}

	async function handleDelete(project: Project) {
		try {
			dispatch({ type: "DELETE", payload: project });
			if (error) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				throw new Error("Something went wrong");
			}
			await deleteProject(project.id);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((data: NewProject) =>
						startTransition(() => onSubmit(data)),
					)}
					className="flex items-center gap-1 rounded-full bg-foreground/5 p-1"
				>
					<Input
						type="text"
						{...form.register("name")}
						placeholder="Name"
						className="rounded-l-full"
					/>
					<Input
						type="text"
						{...form.register("description")}
						placeholder="Description"
					/>

					{/* Status Select */}
					<FormField
						control={form.control}
						name="status"
						render={({ field }) => (
							<FormItem>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value as string}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select status" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="active">
											Active
										</SelectItem>
										<SelectItem value="inactive">
											Inactive
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						variant="outline"
						disabled={isLoading}
						className="rounded-r-full"
					>
						{isLoading ? "Submitting" : "Submit"}
						{isLoading ? (
							<Loader2 className="ml-2 h-4 w-4 animate-spin" />
						) : (
							<ChevronRight className="ml-2 h-4 w-4" />
						)}
					</Button>
				</form>
			</Form>

			<section className=" flex items-center justify-between">
				<p>Options:</p>
				<div className="flex items-center space-x-2">
					<Checkbox
						id="error"
						checked={error}
						onClick={() => setError(!error)}
						className="rounded"
					/>
					<label
						htmlFor="error"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Error durring optimistic update
					</label>
				</div>
			</section>

			<Table>
				<TableCaption>
					{!projects ? "isPending..." : "A list of projects"}
				</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>
							<p className="uppercase">Name</p>
						</TableHead>
						<TableHead>
							<p className="uppercase">Description</p>
						</TableHead>
						<TableHead>
							<p className="flex items-center uppercase">
								<Target className="mr-2 h-4 w-4" /> Status
							</p>
						</TableHead>
						<TableHead>
							<p className="uppercase">Action</p>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>{renderProjectRows()}</TableBody>
			</Table>
		</>
	);
};

export default ProjectTable;

function getChipType(
	type: string,
	field: string | null,
): VariantProps<typeof projectChipVariants>["chipType"] {
	if (!field) return "null";
	// todo refactor this
	return `${type}_${field}`;
}
