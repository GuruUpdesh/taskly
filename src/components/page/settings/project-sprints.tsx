import React from "react";

import { format, isAfter, isBefore } from "date-fns";
import { ArrowRightIcon } from "lucide-react";

import SprintOptionsForm from "~/components/projects/sprint-options/sprint-options-form";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { type Project, type Sprint } from "~/server/db/schema";
import typography from "~/styles/typography";

type Props = {
	sprints: Sprint[];
	project: Project;
};

const ProjectSprints = ({ sprints, project }: Props) => {
	return (
		<>
			<Label className="font-bold">Current Sprints for Project</Label>
			<div className="mt-1.5 flex max-w-full flex-row flex-wrap items-center overflow-hidden rounded-xl border p-2">
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
								"m-1 flex items-center justify-center gap-2 rounded-full border bg-background py-1 text-muted-foreground",
								active
									? "border-green-500 bg-background px-4 py-1.5 text-green-500 "
									: "",
								idx !== 0 ? "-ml-14 pl-16" : "pl-4",
							)}
						>
							{idx === 0 && (
								<p className="rounded-full bg-background/50 px-2 py-0.5 text-xs">
									{format(sprint.startDate, "MMM, dd")}
								</p>
							)}
							<p>{sprint.name}</p>
							<p className="relative flex items-center px-2 py-0.5 text-xs">
								{format(sprint.endDate, "MMM, dd")}
								{active && (
									<ArrowRightIcon className="absolute -right-5 z-50 h-4 w-4 bg-background text-green-500" />
								)}
							</p>
						</div>
					);
				})}
			</div>
			<Separator className="my-8" />
			<Label className="font-bold">Sprint Options</Label>
			<p
				className={cn(
					typography.paragraph.p,
					"!mt-1 mb-4 text-muted-foreground",
				)}
			>
				Changes will automatically be applied when the next sprint
				starts.
			</p>
			<SprintOptionsForm project={project} />
		</>
	);
};

export default ProjectSprints;
