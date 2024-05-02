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
				<Link href="/" className="w-full border hover:bg-accent transition-colors p-4 py-2 rounded mb-1 bg-background/25">
					Home
				</Link>
        <Link href="/app" className="w-full border hover:bg-accent transition-colors p-4 py-2 rounded mb-1 bg-background/25">
					Application
				</Link>
        <Link href="/create-project" className="w-full border hover:bg-accent transition-colors p-4 py-2 rounded mb-1 bg-background/25">
					Create Project
				</Link>
			</div>
		</div>
	);
}
