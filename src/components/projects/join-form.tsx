"use client";

// hooks
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";

const ProjectJoinForm = () => {
	const [token, setToken] = useState("");

	return (
		<div className="mt-12 w-[600px]">
			<h1 className="mb-2 text-2xl font-extrabold tracking-tight">
				Join an existing project
			</h1>
			<Input
				type="text"
				placeholder="Join Project Code"
				className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				value={token}
				onChange={(e) => setToken(e.target.value)}
			/>
			<Link href={`/join/${token}`}>
				<Button
					variant="outline"
					className="mt-4 inline-flex w-48 items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
				>
					Join
				</Button>
			</Link>
		</div>
	);
};

export default ProjectJoinForm;
