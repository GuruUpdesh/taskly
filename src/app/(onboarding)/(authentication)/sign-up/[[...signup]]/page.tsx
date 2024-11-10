import { ClerkLoading, SignUp } from "@clerk/nextjs";
import { type Metadata } from "next";

import { Skeleton } from "~/components/ui/skeleton";

export const metadata: Metadata = {
	title: "Sign Up",
};

export default function SignUpPage() {
	return (
		<div>
			<ClerkLoading>
				<Skeleton className="h-[642px] w-[400px] rounded-xl" />
			</ClerkLoading>
			<SignUp path="/sign-up" />
		</div>
	);
}
