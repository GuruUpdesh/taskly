import { Calendar } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";

import { env } from "~/env.mjs";
import {
	DataCardLineGraph,
	DataCardAreaGraph,
	DataCardFigure,
} from "../../../../components/dashboard/data-card";

export default function DashboardPage() {
	return (
		<div className="container flex flex-col">
			<section className="mb-3">
				<p className="text-sm text-muted-foreground">
					{env.NODE_ENV.toLocaleUpperCase()} {">"} Projects {">"}{" "}
				</p>
				<header className="flex items-center justify-between gap-2">
					<h3 className="scroll-m-20 text-2xl font-bold tracking-tight">
						Dashboard
					</h3>
					<div className="flex items-center gap-2">
						<Button variant="outline">
							<Calendar className="mr-2 h-4 w-4" />
							Jan 1, 2024 - Jan 31, 2024
						</Button>
						<Button>Download</Button>
					</div>
				</header>
			</section>
			<section className="grid grid-cols-4 gap-4">
				<DataCardFigure />
				<DataCardFigure />
				<DataCardFigure />
				<DataCardFigure />
				<DataCardAreaGraph />
				<DataCardLineGraph />
			</section>
		</div>
	);
}
