"use client";

import React from "react";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import UserButton from "~/app/components/user-button/UserButton";
import { Button } from "~/components/ui/button";

const UserNav = () => {
	return (
		<div className="flex items-center gap-2">
			<SignedIn>
				<Link href="/app">
					<Button
						variant="outline"
						size="sm"
						className="whitespace-nowrap rounded-full bg-foreground/5"
					>
						Application
					</Button>
				</Link>
				<UserButton size="icon" />
			</SignedIn>
			<SignedOut>
				<div className="flex items-center gap-4">
					<Link href="/sign-in">
						<Button
							variant="outline"
							size="sm"
							className="whitespace-nowrap rounded-full bg-foreground/5"
						>
							Sign In
						</Button>
					</Link>
					<Link href="/sign-up">
						<Button
							size="sm"
							className="items-center gap-1 whitespace-nowrap rounded-full bg-gradient-to-r hover:from-green-600 hover:to-green-400 hover:text-foreground"
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
