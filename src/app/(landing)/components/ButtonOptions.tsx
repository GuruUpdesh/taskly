import React from "react";

import { ArrowUpRightIcon, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "~/components/ui/button";

const ButtonOptions = () => {
	return (
		<Button
			className="z-10 group rounded-full  font-bold relative p-0"
			asChild
		>
			<Link href="/app">
				<span className="flex items-center z-10 bg-foreground h-full w-full px-2 rounded-sm">
					Get Started <ArrowUpRightIcon className="w-5 h-5 ml-4"/>
				</span>
				<div className="absolute top-[-1px] h-[102%] w-full overflow-clip rounded-sm blur-sm">
					<div className="absolute left-0 top-0 h-[200%] w-full scale-[3] ">
						<Image
							fill
							src="/static/icon.png"
							alt=""
							className="animate-spin-slow"
						/>
					</div>
				</div>
			</Link>
		</Button>
	);
};

export default ButtonOptions;
