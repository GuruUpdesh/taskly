import React from "react";

import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "~/components/ui/button";

const GetStartedButton = () => {
	return (
		<div className="relative">
			<div className="absolute left-[-1px] top-[-1px] h-[calc(100%+2px)] w-[calc(100%+2px)] overflow-clip rounded-xl blur-md">
				<div className="absolute left-0 top-0 h-[150%] w-full">
					<Image
						className="absolute h-full w-full"
						src="/static/auth-slow.gif"
						alt=""
						fill
					/>
				</div>
			</div>
			<Button
				className="group relative rounded-xl border bg-background-dialog p-0 px-2 font-bold text-foreground hover:text-background-dialog"
				asChild
			>
				<Link href="/app">
					Get Started <ArrowUpRightIcon className="ml-4 h-5 w-5" />
				</Link>
			</Button>
		</div>
	);
};

export default GetStartedButton;
