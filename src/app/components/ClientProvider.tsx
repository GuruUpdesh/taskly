"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

type Props = {
	children: React.ReactNode;
};

export default function ClientProvider({ children }: Props) {
	return (
		<ClerkProvider
			appearance={{
				baseTheme: dark,
				variables: {
					colorBackground: "#000000",
					colorInputBackground: "#1b1b1b",
				},
			}}
		>
			{children}
		</ClerkProvider>
	);
}
