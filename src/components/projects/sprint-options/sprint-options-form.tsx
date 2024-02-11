"use client";

import React from "react";
import SprintOptions from "./sprint-options";
import { Button } from "~/components/ui/button";
import { ChevronRight } from "lucide-react";
import { type Project, insertProjectSchema } from "~/server/db/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { endOfYesterday, isEqual } from "date-fns";
import { updateSprintsForProject } from "~/actions/sprint-actions";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
	project: Project;
};

export type ProjectSprintOptions = Pick<
	Project,
	"sprintDuration" | "sprintStart"
>;
const ProjectSprintOptionsSchema = z.object({
	sprintDuration: z.number().min(1).max(4),
	sprintStart: z.date().min(endOfYesterday()),
});

const SprintOptionsForm = ({ project }: Props) => {
	const form = useForm<ProjectSprintOptions>({
		mode: "onChange",
		resolver: zodResolver(ProjectSprintOptionsSchema),
		defaultValues: {
			sprintDuration: project.sprintDuration,
			sprintStart: project.sprintStart,
		},
	});

	const [loading, setLoading] = React.useState(false);
	async function onSubmit(formData: ProjectSprintOptions) {
		console.log("formData", formData);
		setLoading(true);
		const result = await updateSprintsForProject(
			project.id,
			formData.sprintDuration,
			formData.sprintStart,
		);
		setLoading(false);
		if (result) {
			toast.success("Updated sprint options");
		} else {
			toast.error("Failed to update sprint options");
			form.reset();
		}
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<SprintOptions form={form} />
			<div className="mt-4 flex w-full items-center justify-between gap-8">
				<div />
				<Button
					disabled={
						!form.formState.isValid &&
						form.watch("sprintDuration") ===
							project.sprintDuration &&
						isEqual(form.watch("sprintStart"), project.sprintStart)
					}
					type="submit"
				>
					{loading ? "Saving" : "Save"}
					<ChevronRight className="ml-2 h-4 w-4" />
				</Button>
			</div>
		</form>
	);
};

export default SprintOptionsForm;
