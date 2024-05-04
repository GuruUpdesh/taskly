import React from "react";

import { Sora } from "next/font/google";
import Link from "next/link";

import { cn } from "~/lib/utils";

import MarketingTaskChips from "../(landing)/components/AnimatedLogoChips";

const sora = Sora({ subsets: ["latin"] });

const Logo = () => {
	return (
		<Link
			href="/"
			className={cn(sora.className, "relative flex items-baseline")}
		>
			<MarketingTaskChips />
			<h1 className="text-2xl font-medium">Taskly</h1>
			<span className="ml-1 text-2xl opacity-90">pm</span>
		</Link>
	);
};

export default Logo;
