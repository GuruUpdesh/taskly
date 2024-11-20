import "~/styles/globals.css";
import { Suspense } from "react";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
import { Poppins } from "next/font/google";

import { Toaster } from "~/components/ui/sonner";
import CommandMenu from "~/features/cmd-menu/CommandMenu";
import ReactQueryProvider from "~/lib/react-query-provider";
const GlobalToastHandler = dynamic(
	() => import("~/lib/toast/global-toast-handler"),
	{ ssr: false },
);
import { cn } from "~/lib/utils";

export const maxDuration = 60;

const poppins = Poppins({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});

export const metadata = {
	metadataBase: new URL("https://tasklypm.com"),
	title: {
		default: "Taskly",
		template: "Taskly > %s",
	},
	description: "Simplified project management tool",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider appearance={clerkAppearance}>
			<html lang="en" suppressHydrationWarning>
				<body
					className={cn(
						"!m-0 min-h-screen bg-background bg-gradient-to-b font-sans antialiased",
						poppins.className,
					)}
				>
					<Suspense>
						<GlobalToastHandler />
					</Suspense>
					<CommandMenu />
					<ReactQueryProvider>
						<main className="relative flex min-h-screen flex-col">
							{children}
						</main>
					</ReactQueryProvider>
					<Toaster richColors />
					<SpeedInsights />
				</body>
				<Analytics />
			</html>
		</ClerkProvider>
	);
}

const clerkAppearance = {
	baseTheme: dark,
	elements: {
		card: "bg-accent/25",
		socialButtonsBlockButton:
			"!bg-background-dialog hover:!bg-foreground hover:text-background",
		input: "bg-background-dialog",
		button: "rounded-xl",
		formButtonPrimary: "px-2 py-2",
		buttonArrowIcon: "hidden",
	},
};
