import React from "react";

import { Sora } from "next/font/google";
import Link from "next/link";

import { cn } from "~/lib/utils";

import MarketingTaskChips from "../page/landing/marketing/marketing-task-chips";

const sora = Sora({ subsets: ["latin"] });

const Logo = () => {
	return (
		<Link
			href="/"
			className={cn(sora.className, "relative flex items-baseline")}
		>
			<MarketingTaskChips />
			<h1 className="text-2xl font-medium">Taskly</h1>
			<span className="text-2xl opacity-90">.pm</span>
		</Link>
	);
};

export default Logo;
