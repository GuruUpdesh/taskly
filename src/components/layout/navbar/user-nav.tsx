import React from "react";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import UserButton from "~/components/user-button/user-button";

const UserNav = () => {
	return (
		<div className="flex items-center gap-2">
			<SignedIn>
				<Link href="/app">
					<Button
						variant="outline"
						size="sm"
						className="whitespace-nowrap rounded-full"
					>
						Application
					</Button>
				</Link>
				<UserButton />
			</SignedIn>
			<SignedOut>
				<div className="flex items-center gap-4">
					<Link href="/sign-in">
						<Button
							variant="outline"
							size="sm"
							className="whitespace-nowrap rounded-full"
						>
							Sign In
						</Button>
					</Link>
					<Link href="/sign-up">
						<Button
							size="sm"
							className="items-center gap-1 whitespace-nowrap rounded-full bg-emerald-600 font-bold text-foreground hover:bg-emerald-500"
						>
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
