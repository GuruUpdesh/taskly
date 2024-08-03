import React from "react";

import Link from "next/link";

import { Button } from "~/components/ui/button";

const ButtonOptions = () => {
	return (
		<div className="flex w-full items-center justify-between gap-4">
			<div>
				<Button
					variant="outline"
					className="mr-4 rounded-full bg-transparent backdrop-blur-lg"
					asChild
				>
					<Link
						href="https://www.youtube.com/watch?v=2JG1OJx5DK8"
						target="_blank"
						aria-label="Watch a demo"
					>
						Watch a Demo
					</Link>
				</Button>
				<Button
					variant="outline"
					className="rounded-full bg-transparent backdrop-blur-lg"
					asChild
				>
					<Link
						href="https://docs.tasklypm.com"
						target="_blank"
						aria-label="Documentationx"
					>
						Documentation
					</Link>
				</Button>
			</div>
		</div>
	);
};

export default ButtonOptions;
