import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { getTaskConfig } from "~/entities/task-entity";
import { type NewTask, type Task } from "~/server/db/schema";
import PropertyStatic from "./property-static";
import DataCellSelect from "../propery-select";

type Props = {
	property: keyof Task;
    form: UseFormReturn<NewTask>
    onSubmit: (newTask: NewTask) => void
};

function Property({ property, form, onSubmit }: Props) {
	const config = getTaskConfig(property);

    if (property !== "id" && config.type === "text") {
        return <PropertyStatic form={form} property={property} config={config} />
    }

    if (property !== "id" && config.type === "select") {
        return <DataCellSelect form={form} col={property} config={config} isNew={false} onSubmit={onSubmit} />
    }

	return <div>{property}</div>;
}

export default Property;
