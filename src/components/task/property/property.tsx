import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { buildDynamicOptions, getTaskConfig } from "~/entities/task-entity";
import type { User, NewTask, Task } from "~/server/db/schema";
import PropertyStatic from "./property-static";
import DataCellSelect from "./propery-select";

type Props = {
	property: keyof Task;
	form: UseFormReturn<Task>;
	onSubmit: (newTask: NewTask) => void;
	assignees: User[];
	size: "default" | "icon";
};

function Property({ property, form, onSubmit, assignees, size }: Props) {
	const config = buildDynamicOptions(
		getTaskConfig(property),
		property,
		assignees,
	);

	if (property !== "id" && config.type === "text") {
		return <PropertyStatic form={form} property={property} />;
	}

	if (property !== "id" && config.type === "select") {
		return (
			<DataCellSelect
				form={form}
				col={property}
				config={config}
				isNew={false}
				onSubmit={onSubmit}
				size={size}
			/>
		);
	}

	return <div>{property}</div>;
}

export default Property;
