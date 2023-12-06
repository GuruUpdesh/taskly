import "~/styles/globals.css";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "~/components/themes-switcher";

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
			<ModeToggle />
			{children}
		</div>
	);
}
