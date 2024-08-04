import React from "react";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";

const ButtonOptions = () => {
	return (
		<div className="flex items-center gap-4">
			<Button
				variant="outline"
				className="bg-transparent backdrop-blur-lg"
				asChild
			>
				<Link
					href="https://www.youtube.com/watch?v=2JG1OJx5DK8"
					target="_blank"
					aria-label="Watch a demo"
				>
					Demo Video
				</Link>
			</Button>
			<Button
				variant="outline"
				className="bg-transparent backdrop-blur-lg"
				asChild
			>
				<Link
					href="https://docs.tasklypm.com"
					target="_blank"
					aria-label="Documentationx"
				>
					Docs
				</Link>
			</Button>
			<Button className="group rounded-full" asChild>
				<Link href="/app" aria-label="Get Started">
					Get Started
					<ArrowRight className="ml-1 h-4 w-4 transition-all duration-300 ease-in-out group-hover:ml-2" />
				</Link>
			</Button>
		</div>
	);
};

export default ButtonOptions;
