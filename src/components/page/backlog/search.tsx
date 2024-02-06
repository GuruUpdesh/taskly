"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React from "react";
import { Input } from "~/components/ui/input";
import { useSearchStore } from "~/store/search";

const Search = () => {
	const [backlogSearch, updateBacklogSearch] = useSearchStore((state) => [
		state.backlogSearch,
		state.updateBacklogSearch,
	]);

	return (
		<div className="relative">
			<MagnifyingGlassIcon className="absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%] text-muted-foreground" />
			<Input
				placeholder="Search"
				className="h-9 pl-8"
				value={backlogSearch}
				onChange={(e) => updateBacklogSearch(e.target.value)}
			/>
		</div>
	);
};

export default Search;
