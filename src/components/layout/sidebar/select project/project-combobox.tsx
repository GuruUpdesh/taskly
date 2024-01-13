"use client";

import React from "react";
import type { Project } from "~/server/db/schema";
import { ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "~/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";

type Props = {
	projects: Project[];
	projectId: string;
};

const ProjectCombobox = ({ projects, projectId }: Props) => {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState(projectId);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between"
				>
					{value
						? projects.find(
								(project) => String(project.id) === value,
							)?.name
						: "Select framework..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput placeholder="Search framework..." />
					<CommandEmpty>No framework found.</CommandEmpty>
					<CommandGroup>
						{projects.map((project) => (
							<Link
								key={project.id}
								href={`/${project.id}/backlog`}
							>
								<CommandItem
									value={String(project.id)}
									onSelect={(currentValue) => {
										setValue(
											currentValue === value
												? ""
												: currentValue,
										);
										setOpen(false);
									}}
									className={cn(
										value === String(project.id)
											? "bg-accent text-white"
											: "",
									)}
								>
									{project.name}
								</CommandItem>
							</Link>
						))}
					</CommandGroup>
					<CommandGroup className=" border-t">
						<Link href="/test">
							<CommandItem className="flex justify-between">
								New Project
								<PlusIcon />
							</CommandItem>
						</Link>
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default ProjectCombobox;
