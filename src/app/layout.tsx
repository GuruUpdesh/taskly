import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "~/components/ui/theme-provider";
import { cn } from "~/lib/utils";
import { Toaster } from "~/components/ui/sonner";
import { dark } from "@clerk/themes";
import Providers from "./providers";

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
			<html lang="en" suppressHydrationWarning>
				<body
					className={cn(
						"min-h-screen bg-gradient-to-b from-[#02091a] to-[#010714]  bg-background font-sans antialiased",
						GeistSans.className,
					)}
				>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
					>
						<Providers>
							<main>{children}</main>
						</Providers>
					</ThemeProvider>
					<Toaster richColors />
				</body>
			</html>
		</ClerkProvider>
	);
}
