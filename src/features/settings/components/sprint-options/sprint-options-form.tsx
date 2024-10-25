"use client";

import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { isEqual } from "date-fns";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateSprintsForProject } from "~/actions/application/sprint-actions";
import { Button } from "~/components/ui/button";
import { type Project } from "~/server/db/schema";

import SprintOptions from "./sprint-options";

type Props = {
	project: Project;
};

export type ProjectSprintOptions = Pick<
	Project,
	"sprintDuration" | "sprintStart"
>;
const ProjectSprintOptionsSchema = z.object({
	sprintDuration: z.number().min(1).max(4),
	sprintStart: z.date(),
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

	useEffect(() => {
		form.reset({
			sprintDuration: project.sprintDuration,
			sprintStart: project.sprintStart,
		});
	}, [project]);

	const [loading, setLoading] = React.useState(false);
	async function onSubmit(formData: ProjectSprintOptions) {
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
			<div className="mt-4 flex w-full items-center justify-end gap-4">
				<Button
					size="sm"
					variant="secondary"
					type="button"
					onClick={(e) => {
						e.preventDefault();
						form.reset();
					}}
					disabled={
						!form.formState.isDirty || form.formState.isSubmitting
					}
				>
					Cancel
				</Button>
				<Button
					disabled={
						!form.formState.isValid ||
						(form.watch("sprintDuration") ===
							project.sprintDuration &&
							isEqual(
								form.watch("sprintStart"),
								project.sprintStart,
							)) ||
						loading
					}
					type="submit"
					size="sm"
				>
					{loading ? "Saving" : "Save"}
					{loading ? (
						<Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
					) : null}
				</Button>
			</div>
		</form>
	);
};

export default SprintOptionsForm;
