"use client";

import React from "react";

import { DiamondPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useRegisterCommands } from "~/features/cmd-menu/registerCommands";
import { cn } from "~/lib/utils";
import type { Project } from "~/server/db/schema";
import { useRealtimeStore } from "~/store/realtime";

import CreateProjectDialog from "./CreateProjectDialog";

type Props = {
	projects: Project[];
};

function getProjectImageURL(url: string) {
	return url;
}

const ProjectList = ({ projects }: Props) => {
	const currentProject = useRealtimeStore((state) => state.project);

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
	useRegisterCommands(
		projects.map((project, idx) => ({
			id: "project" + project.id,
			label: project.name,
			icon: <>{renderProjectImage(project)}</>,
			shortcut: [],
			action: () => router.push(`/project/${project.id}`),
			group: "Projects",
			priority: -1 - idx,
		})) ?? [],
	);

	return (
		<div>
			<div className="sticky top-0 z-10 flex items-center justify-between bg-background">
				<p className="text-sm uppercase">Projects</p>
				<div className="flex flex-nowrap">
					<CreateProjectDialog>
						<Button variant="ghost" size="icon">
							<DiamondPlus className="h-4 w-4" />
							<span className="sr-only">New Project</span>
						</Button>
					</CreateProjectDialog>
				</div>
			</div>
			{projects.map((project) => {
				return (
					<Link
						key={project.id}
						href={`/project/${project.id}/tasks`}
					>
						<Button
							variant="ghost"
							className={cn(
								"group w-full justify-between gap-2 overflow-hidden font-normal text-foreground opacity-50 transition-all hover:opacity-100",
								{
									"opacity-100":
										project.id === currentProject?.id,
								},
							)}
						>
							<div className="flex items-center gap-2 whitespace-nowrap">
								<span
									className="relative h-4 w-4 rounded-full saturate-200"
									style={{
										backgroundColor: project?.color,
									}}
								></span>
								{project.name}
							</div>
						</Button>
					</Link>
				);
			})}
		</div>
	);
};

export default ProjectList;
