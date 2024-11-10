import React, { Suspense } from "react";

import { Sora } from "next/font/google";

import UserNav from "~/components/layout/navbar/user-nav";
import Logo from "~/components/Logo";
import { cn } from "~/lib/utils";

const sora = Sora({ subsets: ["latin"] });

const Navbar = () => {
	return (
		<header className={cn(sora.className, "z-40 flex justify-center py-2")}>
			<div className="flex h-12 w-full max-w-[1400px] items-center justify-between px-8 @container md:px-4 2xl:px-0">
				<Logo />
				<Suspense>
					<UserNav />
				</Suspense>
			</div>
		</header>
	);
};

export default Navbar;
