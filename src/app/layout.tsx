import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "~/components/ui/theme-provider";
import { cn } from "~/lib/utils";
import { SettingsContextProvider } from "~/hooks/context/SettingsContext";
import { Toaster } from "~/components/ui/sonner";
import { dark } from "@clerk/themes";

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
						"min-h-screen bg-background font-sans antialiased",
						GeistSans.className,
					)}
				>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
					>
						<SettingsContextProvider>
							<main>{children}</main>
						</SettingsContextProvider>
					</ThemeProvider>
					<Toaster />
				</body>
			</html>
		</ClerkProvider>
	);
}
