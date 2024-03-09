import React from "react";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import UserButton from "~/components/user-button/user-button";

const UserNav = () => {
	return (
		<div>
			<SignedIn>
				<UserButton variant="landing" />
			</SignedIn>
			<SignedOut>
				<div className="flex items-center gap-4">
					<Link href="/sign-in">
						<Button variant="outline" size="sm">
							Sign In
						</Button>
					</Link>
					<Link href="/sign-up">
						<Button className="items-center gap-1 rounded-full bg-green-500 font-bold text-foreground hover:bg-green-400">
							Sign Up
							<ChevronRight className="h-4 w-4" />
						</Button>
					</Link>
				</div>
			</SignedOut>
		</div>
	);
};

export default UserNav;
