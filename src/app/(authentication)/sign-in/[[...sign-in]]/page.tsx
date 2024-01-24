import { ClerkLoading, SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Skeleton } from "~/components/ui/skeleton";

export default function SignInPage() {
	return (
		<div>
			<ClerkLoading>
				<Skeleton className="h-[459px] w-[400px] rounded-sm bg-background" />
			</ClerkLoading>
			<SignIn
				path="/sign-in"
				routing="path"
				appearance={{
					baseTheme: dark,
					variables: {
						colorBackground: "#020817",
						colorInputBackground: "#020817",
					},
				}}
			/>
		</div>
	);
}
