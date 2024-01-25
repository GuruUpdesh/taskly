"use client";

import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { z } from "zod";
import Crumb from "./crumb";
import { useProjectStore } from "~/store/project";

const CRUMBTYPES = ["project", "notification"] as const;
type CrumbType = (typeof CRUMBTYPES)[number];
const crumbTypeEnum = z.enum(CRUMBTYPES);

export type Crumb = {
	name: string;
	id?: number;
	link: string;
};

function getCrumbs(
	pathname: string,
	fetchNameFromAPI: (id: string, type?: CrumbType) => string,
) {
	const crumbs = pathname.split("/").filter((crumb) => crumb !== "");

	const breadcrumbList: Crumb[] = [];

	for (let i = 0; i < crumbs.length; i++) {
		const crumb = crumbs[i] ?? "";
		let name = "";
		let link = "/" + crumbs.slice(0, i + 1).join("/");
		const nextCrumb = crumbs[i + 1] ?? "";

		if (i + 1 < crumbs.length && /^\d+$/.test(nextCrumb)) {
			const validCrumbType = crumbTypeEnum.safeParse(crumb);
			if (!validCrumbType.success) {
				// Invalid crumb type, skip
				console.error("Invalid crumb type", crumb);
				continue;
			}
			const crumbType: CrumbType = validCrumbType.data;
			name = fetchNameFromAPI(nextCrumb, crumbType);
			link = "/" + crumbs.slice(0, i + 2).join("/");
			i++; // Skip the next crumb as it's already handled
		} else {
			// Static page or a numeric ID without a preceding name
			name = /^\d+$/.test(crumb) ? fetchNameFromAPI(crumb) : crumb;
		}

		breadcrumbList.push({ name, link });
	}

	console.log(breadcrumbList);
	return breadcrumbList;
}

const BreadCrumbs = () => {
	const pathname = usePathname();
	const [crumbs, setCrumbs] = React.useState<Crumb[]>([]);
	const project = useProjectStore((state) => state.project);

	function fetchNameFromAPI(id: string, type?: CrumbType) {
		if (type === "project") {
			return project?.name + ` (${id})` ?? "";
		}

		return "Placeholder";
	}

	useEffect(() => {
		setCrumbs(getCrumbs(pathname, fetchNameFromAPI));
	}, [pathname, project]);

	return (
		<div className="flex items-end gap-1">
			{crumbs.map((crumb, index) => (
				<Crumb
					key={index}
					{...crumb}
					last={index === crumbs.length - 1}
				/>
			))}
		</div>
	);
};

export default BreadCrumbs;
