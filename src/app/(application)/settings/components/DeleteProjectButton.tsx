"use client";

import React, { useState } from "react";

import { handleDeleteProject } from "~/actions/settings/settings-actions";
import Message from "~/app/components/Message";
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

type Props = {
	projectName: string;
	projectId: number;
};

function DeleteProjectButton({ projectName, projectId }: Props) {
	const [inputValue, setInputValue] = useState("");
	const [isMatch, setIsMatch] = useState(false);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setInputValue(value);
		setIsMatch(value === projectName);
	};

	const deleteProject = async () => {
		if (isMatch) {
			await handleDeleteProject(projectId);
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="destructive"
					className={
						"flex h-min items-center justify-between space-x-2 whitespace-nowrap rounded-sm border border-red-700 bg-red-900 p-2 px-3 text-sm text-red-300 ring-offset-background placeholder:text-muted-foreground focus:bg-red-700 focus:text-red-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					}
					style={{ width: "fit-content" }}
				>
					Delete Project
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="mb-4">
						Delete {projectName ? projectName : "error"}?
					</DialogTitle>
					<Message type="warning" className="w-full text-sm">
						Warning this action cannot be undone!
					</Message>
					<DialogDescription>
						This will permanently delete the project{" "}
						<b>{projectName ? projectName : "error"}</b>. This
						includes all tasks, comments, activity, etc. Deletion
						will not affect data related to 3rd party integrations.
					</DialogDescription>
				</DialogHeader>
				<Label>
					To confirm, type &quot;
					<b>{projectName ? projectName : "error"}</b>&quot; in the
					box below
				</Label>
				<Input
					type="text"
					placeholder="Type project name"
					value={inputValue}
					onChange={handleInputChange}
					className="rounded border p-2"
				/>
				<DialogFooter className="sm:justify-start">
					<DialogClose asChild>
						<Button
							type="submit"
							variant="destructive"
							size="sm"
							onClick={deleteProject}
							disabled={!isMatch}
							className="w-full"
						>
							I understand the consequences, delete project
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default DeleteProjectButton;
