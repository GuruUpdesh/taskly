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
import Image from "next/image";

type Props = {
	projects: Project[];
	projectId: string;
};

const ProjectCombobox = ({ projects, projectId }: Props) => {
	const [open, setOpen] = React.useState(false);

	const project = projects.find(
		(project) => String(project.id) === projectId,
	);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between whitespace-nowrap"
				>
					{project?.image ? (
						<Image
							src={project.image}
							alt={project.name}
							width={24}
							height={24}
							className="rounded-full"
						/>
					) : null}
					{project ? project.name : "Select project..."}
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
											"flex items-center gap-2",
											projectId === String(project.id)
												? "bg-primary text-background hover:bg-primary/50"
												: "",
										)}
									>
										<Image
											src={
												project.image ?? "/project.svg"
											}
											alt={project.name}
											width={24}
											height={24}
											className="rounded-full"
										/>
										{project.name}
									</CommandItem>
								</Link>
							))}
						</CommandGroup>
						<CommandGroup className=" border-t">
							<Link href="/create-project">
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
