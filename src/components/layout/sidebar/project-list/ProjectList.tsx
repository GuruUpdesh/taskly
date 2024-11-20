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
import type { Project } from "~/schema";
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
			<div className="sticky top-0 z-10 flex items-center justify-between bg-background py-1">
				<p className="font-medium">Projects</p>
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
								"group relative h-[36px] w-full justify-between gap-2 rounded-xl font-normal text-foreground opacity-50 transition-all hover:opacity-100",
								{
									"opacity-100":
										project.id === currentProject?.id,
								},
							)}
						>
							{project.name}
							<span
								className="relative h-3 w-3 rounded-full saturate-200"
								style={{
									backgroundColor: project?.color,
								}}
							></span>
						</Button>
					</Link>
				);
			})}
			<CreateProjectDialog>
				<Button
					variant="ghost"
					className="h-[36px] w-full justify-start gap-2 rounded-xl"
				>
					<DiamondPlus className="h-4 w-4" />
					Add Project
				</Button>
			</CreateProjectDialog>
		</div>
	);
};

export default ProjectList;
