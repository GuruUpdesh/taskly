import { ActivityLogIcon } from "@radix-ui/react-icons";
import LeftDrawer from "~/components/layout/left-drawer";
import Navbar from "~/components/layout/navbar/navbar";
import ProjectList from "~/components/layout/navbar/project-list";
import { Button } from "~/components/ui/button";
import "~/styles/globals.css";

export const metadata = {
	title: "Taskly",
	description: "Simplified project management tool",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function ProjectsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex">
			<LeftDrawer>
				<div className="border-b"/>
				<p className="text-sm text-muted-foreground uppercase">Views</p>
				<Button variant="ghost" size="sm" className="gap-2 font-semibold px-4">
					<ActivityLogIcon />
					Backlog
				</Button>
			</LeftDrawer>
			<main className="grow">{children}</main>
		</div>
	);
}
