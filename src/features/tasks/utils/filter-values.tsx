import pluralize from "pluralize";

import { type getPropertyConfig, taskVariants } from "~/config/taskConfigType";
import { cn } from "~/lib/utils";

export function renderFilterValues(
	values: string[],
	config: ReturnType<typeof getPropertyConfig> | null,
	showText = true,
) {
	if (!config || (config.type !== "enum" && config.type !== "dynamic"))
		return null;
	const options = config.options;
	const pluralProperty = pluralize(config.displayName);

	return (
		<div
			className={cn(
				"flex items-center gap-2 mix-blend-screen",
				values.length > 1 && "mx-2",
			)}
		>
			{values.map((value) => {
				const option = options.find((option) => option.key === value);
				if (!option) return null;

				return (
					<div
						key={option.key}
						className={cn(
							taskVariants({
								color: option.color,
								context:
									values.length === 1 ? "menu" : "default",
							}),
							"flex items-center",
							values.length === 1
								? "flex !bg-transparent "
								: "relative z-10 -m-2 flex gap-1 overflow-hidden rounded-full p-1 shadow-sm ring-2 ring-black after:absolute after:-left-[1px] after:-top-[1px] after:-z-[1] after:h-full after:w-full after:border after:border-black after:bg-black",
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
				<div className="ml-2">
					<span>{values.length} </span>
					<span>{pluralProperty}</span>
				</div>
			) : null}
		</div>
	);
}
