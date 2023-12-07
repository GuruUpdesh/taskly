import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ThemeProvider } from "~/components/ui/theme-provider";
import Navbar from "~/components/layout/navbar/navbar";
import ProjectList from "~/components/layout/navbar/project-list";
import { cn } from "~/lib/utils";
import Image from "next/image";
import { ModeToggle } from "~/components/themes-switcher";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import UserNav from "~/components/layout/user-nav";

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
		<ClerkProvider>
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
						<div className="flex min-h-screen flex-col">
							<header className="sticky top-0 z-40 border-b bg-background">
								<div className="container flex h-16 items-center justify-between py-4">
									<Link href="/">
										<Image
											src="/static/taskly-logo.png"
											alt="logo"
											height="38"
											width="100"
										/>
									</Link>
									<Navbar>
										<ProjectList />
									</Navbar>
									<div className="flex items-center space-x-2">
										<ModeToggle />
										<UserNav />
									</div>
								</div>
							</header>
							{children}
						</div>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
