/* eslint-disable @next/next/no-img-element */
import React from "react";

import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";

const GetStartedButton = () => {
	return (
		<Button
			className="group relative z-10  rounded-full p-0 font-bold"
			asChild
		>
			<Link href="/app">
				<span className="z-10 flex h-full w-full items-center rounded-xl border bg-background-dialog px-2 text-foreground">
					Get Started <ArrowUpRightIcon className="ml-4 h-5 w-5" />
				</span>
				<div className="absolute left-[-1px] top-[-1px] h-[calc(100%+2px)] w-[calc(100%+2px)] overflow-clip rounded-xl blur-md">
					<div className="absolute left-0 top-0 h-[150%] w-full">
						<img
							className="absolute h-full w-full"
							src="/static/auth-slow.gif"
							alt="backdrop"
						/>
					</div>
				</div>
			</Link>
		</Button>
	);
};

export default GetStartedButton;
