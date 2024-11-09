import { ClerkLoading, SignIn } from "@clerk/nextjs";
import { type Metadata } from "next";

import { Skeleton } from "~/components/ui/skeleton";

export const metadata: Metadata = {
	title: "Sign In",
};

export default function SignInPage() {
	return (
		<div>
			<ClerkLoading>
				<Skeleton className="h-[482px] w-[400px] rounded-xl" />
			</ClerkLoading>
			<SignIn path="/sign-in" />
		</div>
	);
}
