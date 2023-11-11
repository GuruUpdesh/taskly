import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";

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
		<html
			lang="en"
			className="min-h-screen bg-background font-sans antialiased"
		>
			<body className={GeistSans.className}>{children}</body>
		</html>
	);
}
