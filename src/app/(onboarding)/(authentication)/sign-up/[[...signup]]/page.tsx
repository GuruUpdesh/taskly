import { ClerkLoading, SignUp } from "@clerk/nextjs";
import { Skeleton } from "~/components/ui/skeleton";

export default function SignUpPage() {
	return (
		<div>
			<ClerkLoading>
				<Skeleton className="h-[536px] w-[400px] rounded-sm bg-background" />
			</ClerkLoading>
			<SignUp path="/sign-up" routing="path" />
		</div>
	);
}
