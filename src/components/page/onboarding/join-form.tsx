"use client";

// hooks
import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Label } from "~/components/ui/label";
import { ChevronRight } from "lucide-react";

const ProjectJoinForm = () => {
	const [token, setToken] = useState("");

	return (
		<div className="flex flex-col rounded-lg border bg-background/75 p-4 shadow-xl backdrop-blur-lg">
			<Label
				className="text-md mb-2 pl-2 text-muted-foreground"
				htmlFor="join-project-code"
			>
				Join a Project
			</Label>
			<div className="relative">
				<Input
					id="join-project-code"
					type="text"
					placeholder="Code"
					className="w-full rounded-full border px-4 py-2"
					value={token}
					onChange={(e) => setToken(e.target.value)}
				/>
				<Link
					href={`/join/${token}`}
					className="absolute right-0 top-0 h-full"
				>
					<Button
						size="sm"
						variant="outline"
						className="h-full w-full rounded-full px-4 pl-8"
					>
						Join
						<ChevronRight className="ml-2 h-4 w-4" />
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default ProjectJoinForm;
