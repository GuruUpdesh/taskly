import React from "react";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";

const ButtonOptions = () => {
	return (
		<div className="flex w-full items-center justify-between gap-4">
			<div>
				<Link
					href="https://www.youtube.com/watch?v=2JG1OJx5DK8"
					target="_blank"
				>
					<Button
						variant="outline"
						className="mr-4 rounded-full bg-transparent backdrop-blur-lg"
					>
						Watch a Demo
					</Button>
				</Link>
				<Link href="https://docs.tasklypm.com" target="_blank">
					<Button
						variant="outline"
						className="rounded-full bg-transparent backdrop-blur-lg"
					>
						Documentation
					</Button>
				</Link>
			</div>
			<Link href="/app">
				<Button className="group rounded-full bg-gradient-to-r font-bold hover:from-green-600 hover:to-green-400 hover:text-foreground">
					<span className="flex items-center">
						Get Started <ChevronRight className="h-4 w-4" />
					</span>
				</Button>
			</Link>
		</div>
	);
};

export default ButtonOptions;
