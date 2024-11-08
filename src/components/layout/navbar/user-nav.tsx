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
						className="whitespace-nowrap rounded-xl bg-background-dialog shadow-none"
					>
						Dashboard
					</Button>
				</Link>
				<UserButton size="icon" />
			</SignedIn>
			<SignedOut>
				<div className="flex items-center gap-4">
					<Button
						variant="outline"
						size="sm"
						className="whitespace-nowrap rounded-xl bg-background-dialog shadow-none"
						asChild
					>
						<Link href="/sign-in">Login</Link>
					</Button>
				</div>
			</SignedOut>
		</div>
	);
};

export default UserNav;
