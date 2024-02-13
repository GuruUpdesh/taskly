"use client";

import React, { useRef } from "react";
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
import { Skeleton } from "~/components/ui/skeleton";

type Props = {
	projects: Project[];
	projectId: string | null;
	onLandingPage?: boolean;
};

const ProjectCombobox = ({
	projects,
	projectId,
	onLandingPage = false,
}: Props) => {
	const [open, setOpen] = React.useState(false);

	const project = projects.find(
		(project) => String(project.id) === projectId,
	);

	const buttonRef = useRef<HTMLButtonElement>(null);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					ref={buttonRef}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="z-10 w-full justify-center gap-2 whitespace-nowrap bg-background/75 px-1 @sidebar:justify-between @sidebar:px-4"
				>
					{project?.image ? (
						<Image
							src={project.image}
							alt={project.name}
							width={24}
							height={24}
							className="min-w-[24px] rounded-full mix-blend-screen"
						/>
					) : (
						<Skeleton className="h-6 w-6 rounded-full" />
					)}
					<span className="hidden @sidebar:inline-flex">
						{project ? project.name : "Select project..."}
					</span>
					<ChevronsUpDown className="hidden h-4 w-4 shrink-0 opacity-50 @sidebar:inline-flex" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				style={{
					width: buttonRef.current
						? buttonRef.current.offsetWidth
						: "",
				}}
				className="w-full min-w-max bg-background/50 p-0"
			>
				<Command className="w-full bg-transparent backdrop-blur-xl">
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
										{project.image ? (
											<Image
												src={
													project.image ??
													"/project.svg"
												}
												alt={project.name}
												width={24}
												height={24}
												className="rounded-full"
											/>
										) : (
											<Skeleton className="h-6 w-6 rounded-full mix-blend-overlay" />
										)}
										{project.name}
									</CommandItem>
								</Link>
							))}
						</CommandGroup>
					</CommandList>
					<CommandGroup className=" border-t">
						<Link href="/create-project">
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
