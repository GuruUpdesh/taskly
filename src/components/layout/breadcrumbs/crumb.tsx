import React from 'react'
import { Crumb as TypeCrumb } from './breadcrumbs';
import { cn } from '~/lib/utils';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface CrumbProps extends TypeCrumb {
	last: boolean;
}

const Crumb = ({ name, link, last }: CrumbProps) => {
	return (
		<>
			<div
				className={cn(
					"flex items-center rounded-sm  hover:bg-accent py-1",
					last ? "bg-accent px-2 font-bold" : "bg-transparent px-1 text-muted-foreground",
				)}
			>
				<Link
					aria-disabled={last}
					href={link}
					className={cn("text-sm capitalize flex items-center gap-1")}
				>
					{name}
				</Link>
			</div>
            {!last ? (
                <ChevronRight className="h-4 w-4 text-muted-foreground my-1" />
            ) : null}
		</>
	);
};

export default Crumb;