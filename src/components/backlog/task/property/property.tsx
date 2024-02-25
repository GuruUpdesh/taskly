import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { buildDynamicOptions, getTaskConfig } from "~/config/task-entity";
import type { User, NewTask, Task, Sprint } from "~/server/db/schema";
import PropertyStatic from "./property-static";
import PropertySelect from "./propery-select";
import { type TaskConfig } from "~/config/entityTypes";

type Props = {
	property: keyof Task;
	form: UseFormReturn<NewTask>;
	onSubmit: (newTask: NewTask) => void;
	assignees: User[];
	sprints: Sprint[];
	size: "default" | "icon";
};

function Property({
	property,
	form,
	onSubmit,
	assignees,
	sprints,
	size,
}: Props) {
	const config = buildDynamicOptions(
		getTaskConfig(property as keyof TaskConfig),
		property,
		assignees,
		sprints,
	);

	if (property !== "id" && config.type === "text") {
		return <PropertyStatic form={form} property={property} />;
	}

	if (property !== "id" && config.type === "select") {
		return (
			<PropertySelect
				form={form}
				col={property}
				config={config}
				onSubmit={onSubmit}
				size={size}
			/>
		);
	}

	return <div>{property}</div>;
}

export default Property;
