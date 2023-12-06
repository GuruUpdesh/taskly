import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "~/components/ui/navbar";

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
					<Navbar />
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
