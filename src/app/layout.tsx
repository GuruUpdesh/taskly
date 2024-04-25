import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";

import KBar from "~/app/components/Kbar";
import { Toaster } from "~/components/ui/sonner";
import KBarProvider from "~/lib/kbar-provider";
import ReactQueryProvider from "~/lib/react-query-provider";
import GlobalToastHandler from "~/lib/toast/global-toast-handler";
import { cn } from "~/lib/utils";

export const metadata = {
	metadataBase: new URL("https://tasklypm.com"),
	title: {
		default: "Taskly",
		template: "%s | Taskly",
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
				<GlobalToastHandler>
					<html lang="en" suppressHydrationWarning>
						<body
							className={cn(
								"!m-0 min-h-screen bg-background bg-gradient-to-b font-sans antialiased",
								GeistSans.className,
							)}
						>
							<ReactQueryProvider>
								<main className="relative flex min-h-screen flex-col">
									{children}
								</main>
							</ReactQueryProvider>
							<Toaster richColors />
						</body>
						<Analytics />
					</html>
				</GlobalToastHandler>
			</KBarProvider>
		</ClerkProvider>
	);
}
