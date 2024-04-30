import React, { Suspense } from "react";

import { Sora } from "next/font/google";

import UserNav from "~/app/components/layout/navbar/user-nav";
import Logo from "~/app/components/Logo";
import { cn } from "~/lib/utils";

const sora = Sora({ subsets: ["latin"] });

const Navbar = () => {
	return (
		<header
			className={cn(
				sora.className,
				"sticky top-0 z-40 flex justify-center border border-foreground/5 py-2 shadow-lg backdrop-blur-2xl",
			)}
		>
			<div className="container flex h-12 max-w-[1400px] items-center justify-between px-4 @container lg:px-8">
				<Logo />
				<Suspense>
					<UserNav />
				</Suspense>
			</div>
		</header>
	);
};

export default Navbar;
