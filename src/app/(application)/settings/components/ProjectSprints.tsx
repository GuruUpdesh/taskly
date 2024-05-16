import React from "react";

import { format, isAfter, isBefore } from "date-fns";
import { ArrowRightIcon } from "lucide-react";

import SprintOptionsForm from "~/app/(application)/settings/components/sprint-options/sprint-options-form";
import { cn } from "~/lib/utils";
import { type Project, type Sprint } from "~/server/db/schema";

type Props = {
	sprints: Sprint[];
	project: Project;
};

const ProjectSprints = ({ sprints, project }: Props) => {
	return (
		<>
			<div className="mb-4 flex max-w-full flex-row flex-wrap items-center overflow-hidden rounded-md border bg-background-dialog px-4 py-3">
				{sprints.map((sprint, idx) => {
					const active =
						isAfter(new Date(), sprint.startDate) &&
						isBefore(new Date(), sprint.endDate);
					return (
						<div
							key={sprint.id}
							style={{
								zIndex: sprints.length - idx,
							}}
							className={cn(
								"m-1 flex items-center justify-center gap-2 rounded-full border border-accent bg-background-dialog py-1 text-muted-foreground",
								active
									? "border-green-500 bg-background-dialog px-4 py-1.5 text-green-500 "
									: "",
								idx !== 0 ? "-ml-14 pl-16" : "pl-4",
							)}
						>
							{idx === 0 && (
								<p className="px-2 py-0.5 text-xs">
									{format(sprint.startDate, "MMM, dd")}
								</p>
							)}
							<p>{sprint.name}</p>
							<p className="relative flex items-center px-2 py-0.5 text-xs">
								{format(sprint.endDate, "MMM, dd")}
								{active && (
									<ArrowRightIcon className="absolute -right-5 z-50 h-4 w-4 rounded-full bg-background-dialog text-green-500" />
								)}
							</p>
						</div>
					);
				})}
			</div>
			<SprintOptionsForm project={project} />
		</>
	);
};

export default ProjectSprints;
