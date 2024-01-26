import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
    return <div className="pt-2">
        <header className="h-[45px] flex items-center gap-2 justify-between pb-2 border-b container">
            <Skeleton className="h-[20px] w-[25%]" />
            <Skeleton className="h-[36px] w-[25%]" />
        </header>
        <section className="container flex flex-col pt-4">
            {Array(10).fill(0).map((_, i) => (
                <div key={i} className="h-[47px] flex items-center justify-between border-b py-2">
                    <div className="flex items-center gap-2 w-[50%] h-full">
                        <Skeleton className="h-full flex-1" />
                        <Skeleton className="h-full flex-1" />
                        <Skeleton className="h-full flex-1" />
                        <Skeleton className="h-full flex-1" />
                    </div>
                    <Skeleton className="h-full w-[10%]" />
                </div>
            ))}
        </section>
    </div>
  }