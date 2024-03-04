import { ClerkLoading, SignIn } from "@clerk/nextjs";

import { Skeleton } from "~/components/ui/skeleton";

export default function SignInPage() {
	return (
		<div>
			<ClerkLoading>
				<Skeleton className="h-[459px] w-[400px] rounded-sm bg-background" />
			</ClerkLoading>
			<SignIn path="/sign-in" routing="path" />
		</div>
	);
}
