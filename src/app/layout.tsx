import "~/styles/globals.css";
import { Suspense } from "react";

import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";

import KBar from "~/app/components/Kbar";
import { Toaster } from "~/components/ui/sonner";
import KBarProvider from "~/lib/kbar-provider";
import ReactQueryProvider from "~/lib/react-query-provider";
import GlobalToastHandler from "~/lib/toast/global-toast-handler";
import { cn } from "~/lib/utils";

import ClientProvider from "./components/ClientProvider";

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
		<ClientProvider>
			<KBarProvider>
				<KBar />
				<Suspense>
					<GlobalToastHandler />
				</Suspense>
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
			</KBarProvider>
		</ClientProvider>
	);
}
