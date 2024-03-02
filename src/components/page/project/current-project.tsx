import React from "react";

import { eq } from "drizzle-orm";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

import { getProjectApplicationData } from "~/actions/application/redis-actions";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";
import { projects } from "~/server/db/schema";

import ProjectImage from "./project-image";

export function CurrentProjectNavWrapper() {
	return (
		<div>
			<CurrentProject />
		</div>
	);
}

async function CurrentProject() {
	const project = await getProjectApplicationData();
	if (!project) return null;
	const checkForProject = await db
		.select()
		.from(projects)
		.where(eq(projects.id, project.id));

	return (
		<div className="my-2 flex gap-4">
			{!checkForProject || checkForProject.length === 0 ? null : (
				<Link
					href={`/project/${project.id}/backlog`}
					className="flex-grow"
				>
					<Button
						variant="outline"
						className="w-full items-center justify-between gap-1 whitespace-nowrap"
					>
						<ProjectImage project={project} />
						{project.name}
						<ChevronRight className="h-4 w-4" />
					</Button>
				</Link>
			)}
			<Link href={`/create-project`}>
				<Button variant="outline" className="items-center gap-1">
					Create Project
					<Plus className="h-4 w-4" />
				</Button>
			</Link>
		</div>
	);
}

export default CurrentProject;
