import React from "react";

import { Sora } from "next/font/google";
import Link from "next/link";

import { cn } from "~/lib/utils";

import LogoChips from "./LogoChips";

const sora = Sora({ subsets: ["latin"] });

const Logo = () => {
	return (
		<Link
			href="/"
			className={cn(sora.className, "relative flex items-baseline")}
		>
			<LogoChips />
			<h1 className="text-2xl font-medium">Taskly</h1>
		</Link>
	);
};

export default Logo;
