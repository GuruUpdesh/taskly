import { ClerkLoading, SignIn } from "@clerk/nextjs";
import { type Metadata } from "next";

import { Skeleton } from "~/components/ui/skeleton";

export const metadata: Metadata = {
	title: "Sign In",
};

export default function SignInPage() {
	return (
		<div className="text-foreground">
			<ClerkLoading>
				<Skeleton className="h-[459px] w-[400px] rounded-sm bg-background" />
			</ClerkLoading>
			<SignIn path="/sign-in" />
		</div>
	);
}
