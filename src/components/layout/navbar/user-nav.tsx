"use client";

import React from "react";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import UserButton from "~/components/user-button/UserButton";

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
							className="whitespace-nowrap border-none bg-foreground/5 shadow-none"
						>
							Sign In
						</Button>
					</Link>
				</div>
			</SignedOut>
		</div>
	);
};

export default UserNav;
