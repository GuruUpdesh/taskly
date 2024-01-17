import { ClerkLoading, SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Skeleton } from "~/components/ui/skeleton";

export default function SignUpPage() {
	return (
		<div>
            <ClerkLoading>
				<Skeleton className="h-[536px] w-[400px] rounded-sm bg-background" />
			</ClerkLoading>
			<SignUp
				path="/sign-up"
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
