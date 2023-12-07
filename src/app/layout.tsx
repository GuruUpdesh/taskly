import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "~/components/ui/theme-provider";
import Navbar from "~/components/navbar/navbar";
import ProjectList from "~/components/navbar/project-list";

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
			<html
				lang="en"
				className="min-h-screen bg-background font-sans antialiased"
			>
				<body className={GeistSans.className}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<Navbar>
							<ProjectList />
						</Navbar>
						{children}
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
