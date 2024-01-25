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
	CommandList,
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

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between"
				>
					{projectId
						? projects.find(
								(project) => String(project.id) === projectId,
							)?.name
						: "Select project..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput placeholder="Search projects..." />
					<CommandList>
						<CommandEmpty>No project found.</CommandEmpty>
						<CommandGroup>
							{projects.map((project) => (
								<Link
									key={project.id}
									href={`/project/${project.id}/backlog`}
								>
									<CommandItem
										className={cn(
											projectId === String(project.id)
												? "bg-primary text-background hover:bg-primary/50"
												: "",
										)}
									>
										{project.name}
									</CommandItem>
								</Link>
							))}
						</CommandGroup>
						<CommandGroup className=" border-t">
							<Link href="/project">
								<CommandItem className="flex justify-between">
									New Project
									<PlusIcon />
								</CommandItem>
							</Link>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default ProjectCombobox;
