"use client";

import React, { useMemo, useRef } from "react";

import { PlusIcon } from "@radix-ui/react-icons";
import { useRegisterActions } from "kbar";
import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import SimpleTooltip from "~/app/components/SimpleTooltip";
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
import { Skeleton } from "~/components/ui/skeleton";
// import { env } from "~/env.mjs";
import { cn } from "~/lib/utils";
import type { Project } from "~/server/db/schema";
import { useRealtimeStore } from "~/store/realtime";

type Props = {
	projects: Project[];
	projectId: string | null;
};

function getProjectImageURL(url: string) {
	// if (env.NEXT_PUBLIC_NODE_ENV === "development") {
	// 	return "/static/placeholder.png";
	// }
	return url;
}

const ProjectCombobox = ({ projects, projectId }: Props) => {
	const currentProject = useRealtimeStore((state) => state.project);
	const [open, setOpen] = React.useState(false);

	const project = useMemo(() => {
		const foundProject = projects.find(
			(project) => String(project.id) === projectId,
		);
		if (foundProject?.id === currentProject?.id) {
			return currentProject;
		} else {
			return foundProject;
		}
	}, [projects, projectId, currentProject]);

	const buttonRef = useRef<HTMLButtonElement>(null);

	function renderProjectImage(project: Project | null | undefined) {
		if (!project) return null;

		return (
			<>
				{project?.image ? (
					<Image
						src={getProjectImageURL(project.image)}
						alt={project.name}
						width={24}
						height={24}
						className="min-w-[24px] rounded-full mix-blend-screen"
						onError={(e) => {
							e.currentTarget.src = "/project.svg";
						}}
					/>
				) : (
					<Skeleton className="h-6 w-6 rounded-full" />
				)}
			</>
		);
	}

	const router = useRouter();
	useRegisterActions(
		projects.map((project, idx) => ({
			id: String(project.id),
			name: project.name,
			icon: renderProjectImage(project),
			shortcut: idx + 1 < 10 ? ["p", String(idx + 1)] : [],
			perform: () => router.push(`/project/${project.id}`),
			section: "Projects",
		})) ?? [],
		[projects, project],
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<SimpleTooltip label="Switch Project" side="right">
				<PopoverTrigger asChild>
					<Button
						ref={buttonRef}
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className={cn(
							"group relative max-h-[36px] w-full cursor-pointer gap-2 overflow-hidden rounded border-none !bg-transparent font-semibold text-foreground/75 @sidebar:justify-between",
							"bg-gradient-to-r from-background to-transparent to-0% bg-[length:200%] bg-left transition-all duration-300 ease-linear hover:bg-right @sidebar:to-50%",
						)}
					>
						<div className="absolute left-0 -z-10 aspect-square w-full opacity-90 transition-opacity group-hover:opacity-100 group-focus:opacity-100 @sidebar:opacity-75  @sidebar:gradient-mask-l-50">
							{project?.image ? (
								<Image
									src={getProjectImageURL(project.image)}
									alt={project.name}
									fill
								/>
							) : (
								<Skeleton className="h-full w-full" />
							)}
						</div>
						<div className="hidden min-w-0 items-center gap-2 @sidebar:inline-flex">
							<span
								className="h-3 w-3 min-w-3 rounded-full"
								style={{
									backgroundColor: project?.color,
								}}
							></span>
							<span className="max-w-full truncate overflow-ellipsis whitespace-nowrap">
								{project ? project.name : "Select project..."}
							</span>
						</div>
						<ChevronDown className="hidden h-4 w-4 shrink-0 opacity-50 @sidebar:inline-flex" />
					</Button>
				</PopoverTrigger>
			</SimpleTooltip>
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
									href={`/project/${project.id}/tasks`}
								>
									<CommandItem
										value={
											project.name + String(project.id)
										}
										className={cn(
											"group relative cursor-pointer gap-2 overflow-hidden rounded-none !bg-transparent font-semibold text-foreground/75",
											"bg-gradient-to-r from-background to-transparent to-50% bg-[length:200%] bg-left transition-all duration-300 ease-linear hover:bg-right",
										)}
									>
										<div className="absolute left-0 -z-10 aspect-square w-full opacity-50 transition-opacity gradient-mask-l-50 group-hover:opacity-75  group-focus:opacity-75">
											{project.image ? (
												<Image
													src={getProjectImageURL(
														project.image,
													)}
													alt={project.name}
													fill
												/>
											) : (
												<Skeleton className="h-full w-full" />
											)}
										</div>
										<span className="group-focus-opacity-100 absolute right-2 opacity-0 transition-opacity group-hover:opacity-100">
											<ArrowRight className="h-4 w-4" />
										</span>
										<div className="flex items-center gap-2">
											<span
												className="h-3 w-3 rounded-full"
												style={{
													backgroundColor:
														project?.color,
												}}
											></span>
											{project.name}
										</div>
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
