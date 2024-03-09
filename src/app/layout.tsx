import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";

import KBar from "~/components/general/kbar";
import { Toaster } from "~/components/ui/sonner";
import GlobalToastHandler from "~/lib/global-toast/global-toast-handler";
import KBarProvider from "~/lib/kbar-provider";
import ReactQueryProvider from "~/lib/react-query-provider";
import { cn } from "~/lib/utils";

export const metadata = {
	title: "Taskly",
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
					colorBackground: "#020817",
					colorInputBackground: "#020817",
				},
			}}
		>
			<KBarProvider>
				<KBar />
				<GlobalToastHandler>
					<html lang="en" suppressHydrationWarning>
						<body
							className={cn(
								"!m-0 min-h-screen bg-background bg-gradient-to-b from-[#02091a] to-[#010714] font-sans antialiased",
								GeistSans.className,
							)}
						>
							<ReactQueryProvider>
								<main>{children}</main>
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
