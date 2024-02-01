"use client";

// hooks
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { Label } from "../ui/label";
import { ChevronRight } from "lucide-react";

const ProjectJoinForm = () => {
	const [token, setToken] = useState("");

	return (
		<div className="flex flex-col rounded-lg border bg-background/75 p-4 backdrop-blur-lg shadow-xl">
			<Label className="mb-2 pl-2 text-muted-foreground text-md" htmlFor="join-project-code">Join a Project</Label>
			<div className="relative">
				<Input
					id="join-project-code"
					type="text"
					placeholder="Code"
					className="w-full rounded-full border px-4 py-2"
					value={token}
					onChange={(e) => setToken(e.target.value)}
				/>
				<Link href={`/join/${token}`} className="absolute right-0 top-0 h-full">
					<Button size="sm" variant="outline" className="w-full rounded-full h-full px-4 pl-8" >
						Join
						<ChevronRight className="w-4 h-4 ml-2" />
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default ProjectJoinForm;
