import React from "react";

import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "~/components/ui/button";

const GetStartedButton = () => {
	return (
		<div className="relative">
			<div className="absolute left-[-1px] top-[-1px] -z-10 h-[calc(100%+2px)] w-[calc(100%+2px)] overflow-clip rounded-xl bg-background blur-md">
				<div className="absolute left-0 top-0 h-[150%] w-full">
					<Image
						className="absolute h-full w-full animate-spin-slow"
						src="/static/btn.webp"
						alt=""
						fill
					/>
				</div>
			</div>
			<Button
				className="rounded-xl border bg-background-dialog font-bold text-foreground hover:border-foreground hover:text-background-dialog"
				asChild
			>
				<Link href="/sign-up" prefetch>
					Get Started <ArrowUpRightIcon className="ml-4 h-5 w-5" />
				</Link>
			</Button>
		</div>
	);
};

export default GetStartedButton;
