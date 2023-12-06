import "~/styles/globals.css";
import { UserButton } from "@clerk/nextjs";

export const metadata = {
	title: "Taskly",
	description: "Simplified project management tool",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function ApplicationLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<UserButton afterSignOutUrl="/" />
			{children}
		</div>
	);
}
