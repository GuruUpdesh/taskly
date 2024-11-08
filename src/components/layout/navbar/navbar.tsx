import React, { Suspense } from "react";

import { Sora } from "next/font/google";

import UserNav from "~/components/layout/navbar/user-nav";
import Logo from "~/components/Logo";
import { cn } from "~/lib/utils";

const sora = Sora({ subsets: ["latin"] });

const Navbar = () => {
	return (
		<header className={cn(sora.className, "z-40 flex justify-center py-2")}>
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
