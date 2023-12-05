import "~/styles/globals.css";

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
	return <div>{children}</div>;
}
