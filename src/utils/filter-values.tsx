import pluralize from "pluralize";

import {
	type EntityConfigSelect,
	type EntityConfigText,
} from "~/config/entityTypes";
import { optionVariants } from "~/config/task-entity";
import { cn } from "~/lib/utils";

export function renderFilterValues(
	values: string[],
	config: EntityConfigSelect | EntityConfigText | null,
	showText = true,
) {
	if (!config || config.type !== "select") return null;
	const options = config.form.options;
	const pluralProperty = pluralize(config.displayName);

	return (
		<div className="flex items-center gap-2 mix-blend-screen">
			{values.map((value) => {
				const option = options.find(
					(option) => option.value.toString() === value,
				);
				if (!option) return null;

				return (
					<div
						key={option.value}
						className={cn(
							optionVariants({ color: option.color }),
							values.length === 1
								? "flex !bg-transparent"
								: "-m-2 flex gap-1 rounded-full !bg-black p-1",
						)}
					>
						{option.icon}
						{values.length === 1 ? (
							<p className="ml-1">{option.displayName}</p>
						) : null}
					</div>
				);
			})}
			{values.length > 1 && showText ? (
				<div>
					<span>{values.length} </span>
					<span>{pluralProperty}</span>
				</div>
			) : null}
		</div>
	);
}
