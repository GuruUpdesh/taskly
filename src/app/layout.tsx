import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "~/lib/utils";
import { Toaster } from "~/components/ui/sonner";
import { dark } from "@clerk/themes";
import ReactQueryProvider from "~/lib/react-query-provider";
import GlobalToastHandler from "~/lib/global-toast/global-toast-handler";
import KBarProvider from "~/lib/kbar-provider";
import KBar from "~/components/general/kbar";

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
								"!m-0 min-h-screen overflow-hidden bg-background bg-gradient-to-b from-[#02091a] to-[#010714] font-sans antialiased",
								GeistSans.className,
							)}
						>
							<ReactQueryProvider>
								<main>{children}</main>
							</ReactQueryProvider>
							<Toaster richColors />
						</body>
					</html>
				</GlobalToastHandler>
			</KBarProvider>
		</ClerkProvider>
	);
}
