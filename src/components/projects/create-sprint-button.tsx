import React from "react";

import { PlusIcon } from "lucide-react";

import { createSprintForProject } from "~/actions/application/sprint-actions";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";

type Props = {
	projectId: string;
};

async function ConfirmCreateSprint(formData: FormData) {
	"use server";
	const projectId = formData.get("projectId");
	if (!projectId) {
		return;
	}

	await createSprintForProject(Number(projectId));
}

const CreateSprintButton = ({ projectId }: Props) => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="sm" variant="outline">
					Add Sprint
					<PlusIcon className="ml-2 h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Create a Sprint?</DialogTitle>
					<DialogDescription>
						Warning, once this action is completed, it cannot be
						undone. Are you sure you want to create a new sprint for
						this project?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							No
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<form action={ConfirmCreateSprint}>
							<input
								hidden
								name="projectId"
								value={Number(projectId)}
							></input>
							<Button type="submit">Yes</Button>
						</form>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CreateSprintButton;
