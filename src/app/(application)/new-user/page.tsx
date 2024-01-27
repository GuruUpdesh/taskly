"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export default function NewUserLandingPage() {
	const [showTextBox, setShowTextBox] = useState(false);
	const [projectLink, setProjectLink] = useState("");

	const handleJoinProjectClick = () => {
		setShowTextBox(true);
	};

	const handleSubmit = () => {
		if (projectLink.trim() !== "") {
			const formattedLink =
				projectLink.startsWith("http://") ||
				projectLink.startsWith("https://")
					? projectLink
					: `https://${projectLink}`;
			window.location.href = formattedLink;
		}
	};

	const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProjectLink(e.target.value);
	};

	return (
		<div>
			<h1>Welcome to Taskly</h1>
			<br />
			<br />
			<br />
			<Link href="/project">
				<Button size="lg" className="gap-2 font-bold">
					Get Started
				</Button>
			</Link>
			<br />
			<br />
			<br />
			{showTextBox ? (
				<div>
					<input
						type="text"
						placeholder="Enter project link"
						value={projectLink}
						onChange={handleLinkChange}
					/>
					<Button className="border-5" onClick={handleSubmit}>
						Submit
					</Button>
				</div>
			) : (
				<Button className="border-5" onClick={handleJoinProjectClick}>
					Join existing project
				</Button>
			)}
		</div>
	);
}
