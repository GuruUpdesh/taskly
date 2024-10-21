import "~/styles/globals.css";
import { Suspense } from "react";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistSans } from "geist/font/sans";
import dynamic from "next/dynamic";

import KBar from "~/app/components/Kbar";
import { Toaster } from "~/components/ui/sonner";
import KBarProvider from "~/lib/kbar-provider";
import ReactQueryProvider from "~/lib/react-query-provider";
const GlobalToastHandler = dynamic(
	() => import("~/lib/toast/global-toast-handler"),
	{ ssr: false },
);
import { cn } from "~/lib/utils";

export const maxDuration = 60;

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
		<ClerkProvider
			appearance={{
				baseTheme: dark,
				variables: {
					colorBackground: "#000000",
					colorInputBackground: "#1b1b1b",
				},
			}}
		>
			<KBarProvider>
				<KBar />
				<html lang="en" suppressHydrationWarning>
					<body
						className={cn(
							"!m-0 min-h-screen bg-background bg-gradient-to-b font-sans antialiased",
							GeistSans.className,
						)}
					>
						<Suspense>
							<GlobalToastHandler />
						</Suspense>
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
			</KBarProvider>
		</ClerkProvider>
	);
}
