import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="relative flex h-screen w-full">
			<div className="w-[75%] flex-grow">
				<header className="container flex h-[57px] items-center justify-between gap-2 border-b pb-2 pt-2">
					<Skeleton className="h-[20px] w-[25%]" />
				</header>
				<div className="container flex flex-col gap-4 pt-2">
					<Skeleton className="h-[40px] w-[75%]" />
					<Skeleton className="h-[80px] w-full" />
					<Separator />
					<Skeleton className="h-[28px] w-[25%]" />
					<Separator />
					<Skeleton className="h-[28px] w-[25%]" />
				</div>
			</div>
			<div className="w-[25%] flex-grow bg-accent/25">
				<header className="container flex h-[57px] items-center justify-between gap-2 border-b pb-2 pt-2">
					<Skeleton className="h-[20px] w-full" />
				</header>
				<div className="container flex flex-col gap-2 pt-8">
					<Skeleton className="h-[28px] w-full" />
					{Array(6)
						.fill(0)
						.map((_, i) => (
							<div key={i} className="flex h-[28px] gap-2">
								<Skeleton className="h-full max-w-[80px] flex-1" />
								<Skeleton className="h-full flex-1" />
							</div>
						))}
					<Separator className="my-8" />
					<Skeleton className="h-[28px] w-full" />
				</div>
			</div>
		</div>
	);
}
