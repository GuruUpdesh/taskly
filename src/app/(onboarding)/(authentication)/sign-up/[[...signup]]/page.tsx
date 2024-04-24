import { SignUp } from "@clerk/nextjs";
import { type Metadata } from "next";

export const metadata: Metadata = {
	title: "Sign Up",
};

export default function SignUpPage() {
	return (
		<div>
			<SignUp path="/sign-up" />
		</div>
	);
}
