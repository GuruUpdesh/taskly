"use client";

import React, { useState } from "react";

import { leaveProject } from "~/actions/settings/settings-actions";
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

function LeaveProjectButton({ projectName, projectId }: Props) {
	const [inputValue, setInputValue] = useState("");
	const [isMatch, setIsMatch] = useState(false);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setInputValue(value);
		setIsMatch(value === projectName);
	};

	const handleLeaveProject = async () => {
		if (isMatch) {
			await leaveProject(projectId);
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
					Leave Project
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						Leave {projectName ? projectName : "error"}?
					</DialogTitle>
					<Message type="warning" className="w-full text-sm">
						Warning this action cannot be undone!
					</Message>
					<DialogDescription>
						Leaving the project will revoke your access and set all
						your currently assigned tasks to unassigned. You will
						need to be re-invited to rejoin the project.
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
							onClick={handleLeaveProject}
							disabled={!isMatch}
							className="w-full"
						>
							I understand the consequences, leave project
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default LeaveProjectButton;
