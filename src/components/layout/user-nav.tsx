import React from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { SignedIn, UserButton, SignedOut } from "@clerk/nextjs";

const UserNav = () => {
	return (
		<div>
			<SignedIn>
				<UserButton afterSignOutUrl="/" />
			</SignedIn>
			<SignedOut>
				<Link href="/tasks">
					<Button>Login</Button>
				</Link>
			</SignedOut>
		</div>
	);
};

export default UserNav;
