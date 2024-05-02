import Link from "next/link";

import { Separator } from "~/components/ui/separator";

export default function NotFoundCatchAll() {
	return (
		<div className="min-w-screen flex min-h-screen items-center justify-center">
			<div className="flex flex-col rounded-lg border bg-background-dialog p-4">
				<div className="mb-2 flex items-center gap-2 text-2xl">
					<h2 className="font-bold">404</h2>
					<h2>Not Found</h2>
				</div>
				<p className="opacity-75">Could not find requested resource!</p>
				<Separator className="my-4" />
				<Link
					href="/"
					className="mb-1 w-full rounded border bg-background/25 p-4 py-2 transition-colors hover:bg-accent"
				>
					Home
				</Link>
				<Link
					href="/app"
					className="mb-1 w-full rounded border bg-background/25 p-4 py-2 transition-colors hover:bg-accent"
				>
					Application
				</Link>
				<Link
					href="/create-project"
					className="mb-1 w-full rounded border bg-background/25 p-4 py-2 transition-colors hover:bg-accent"
				>
					Create Project
				</Link>
			</div>
		</div>
	);
}
