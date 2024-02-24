import React from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import UserButtonWrapper from "~/components/user-button/user-button-wrapper";

const UserNav = () => {
	return (
		<div>
			<SignedIn>
				<UserButtonWrapper />
			</SignedIn>
			<SignedOut>
				<Link href="/sign-in">
					<Button>Login</Button>
				</Link>
			</SignedOut>
		</div>
	);
};

export default UserNav;
