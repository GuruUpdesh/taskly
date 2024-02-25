import React, { useCallback, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import {
	buildDynamicOptions,
	getTaskConfig,
	optionVariants,
} from "~/config/task-entity";
import { cn } from "~/lib/utils";
import { useAppStore, type Filter } from "~/store/app";
import { Form, FormField, FormItem } from "../ui/form";
import { renderFilterValues } from "~/utils/filter-values";

type Props = {
	children: (menuOpen: boolean) => React.ReactNode;
	defaultValues?: Filter;
};

const properties = [
	"status",
	"priority",
	"type",
	"assignee",
	"sprintId",
] as const;
const formSchema = z.object({
	property: z.enum(properties),
	is: z.boolean(),
	values: z.array(z.any()).min(1),
});

const FilterMenu = ({ children, defaultValues }: Props) => {
	const [open, setOpen] = React.useState(false);

	const [assignees, sprints, addFilter, updateFilter, filters] = useAppStore(
		(state) => [
			state.assignees,
			state.sprints,
			state.addFilter,
			state.updateFilter,
			state.filters,
		],
	);

	const usedProperties = useMemo(() => {
		return filters.map((filter) => filter.property);
	}, [filters]);

	const form = useForm<Filter>({
		resolver: zodResolver(formSchema),
		mode: "onChange",
		defaultValues: defaultValues
			? defaultValues
			: {
					property: "",
					is: true,
					values: [],
				},
	});

	useEffect(() => {
		form.setValue("values", [], {
			shouldValidate: true,
			shouldDirty: true,
		});
	}, [form.watch("property")]);

	useEffect(() => {
		form.setValue("values", defaultValues ? defaultValues.values : [], {
			shouldValidate: true,
			shouldDirty: true,
		});
	}, [defaultValues]);

	function toggleCheck(val: string) {
		const values = form.getValues("values");
		if (values.includes(val)) {
			form.setValue(
				"values",
				values.filter((v) => v !== val),
				{
					shouldValidate: true,
					shouldDirty: true,
				},
			);
		} else {
			form.setValue("values", [...values, val], {
				shouldValidate: true,
				shouldDirty: true,
			});
		}
	}

	const currentConfig = useMemo(() => {
		const property = form.watch("property");
		if (property === "") return null;

		return buildDynamicOptions(
			getTaskConfig(property),
			property,
			assignees,
			sprints,
		);
	}, [form.watch("property")]);

	function onSubmit(values: Filter) {
		if (defaultValues) {
			updateFilter(defaultValues, values);
		} else {
			addFilter(values);
		}
		form.reset();
		setOpen(false);
	}

	const renderValues = useCallback(() => {
		return renderFilterValues(form.watch("values"), currentConfig);
	}, [form.watch("values"), currentConfig, defaultValues]);

	return (
		<Popover open={open} onOpenChange={(open) => setOpen(open)}>
			<PopoverTrigger asChild>{children(open)}</PopoverTrigger>
			<PopoverContent
				className="overflow-hidden rounded-lg bg-background/75 p-0 backdrop-blur-xl"
				align="start"
			>
				<Form {...form}>
					<form
						className="flex flex-col"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name="property"
							render={({ field }) => (
								<FormItem>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger className="max-w-[400px] rounded-none border-b border-l-0 border-r-0 border-t-0 bg-accent/25 hover:bg-accent/50 focus:bg-accent/50 focus:ring-0">
											<SelectValue placeholder="Select Property..." />
											<ChevronDown className="ml-2 h-4 w-4" />
										</SelectTrigger>
										<SelectContent>
											{properties
												.filter((p) => {
													if (
														defaultValues?.property ===
														p
													) {
														return true;
													}
													return !usedProperties.includes(
														p,
													);
												})
												.map((property) => {
													const config =
														getTaskConfig(property);

													if (
														config.type !== "select"
													)
														return null;

													return (
														<SelectItem
															key={config.value}
															value={config.value}
															className="flex items-center justify-between space-x-2 !pl-2 focus:bg-accent/50"
														>
															<div className="flex min-w-[8rem] items-center gap-2">
																<span className="text-muted-foreground">
																	{
																		config.icon
																	}
																</span>
																<p>
																	{
																		config.displayName
																	}
																</p>
															</div>
														</SelectItem>
													);
												})}
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>
						<div className="grid grid-flow-row grid-cols-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								className={cn(
									"rounded-none border-none bg-accent/25 !ring-0 focus:ring-0",
									{
										"bg-accent": form.watch("is"),
									},
								)}
								onClick={() =>
									form.setValue("is", true, {
										shouldValidate: true,
										shouldDirty: true,
									})
								}
							>
								Is
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className={cn(
									"rounded-none border-none bg-accent/25 !ring-0 focus:ring-0",
									{
										"bg-accent": !form.watch("is"),
									},
								)}
								onClick={() =>
									form.setValue("is", false, {
										shouldValidate: true,
										shouldDirty: true,
									})
								}
							>
								Is not
							</Button>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger
								asChild
								disabled={form.watch("property") === ""}
							>
								<button className="flex h-10 w-full max-w-[400px] items-center justify-between whitespace-nowrap rounded-none border-b-0 border-l-0 border-r-0 border-t bg-accent/25 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground hover:bg-accent/50 focus:bg-accent/50 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
									{form.watch("values").length === 0
										? "Select value..."
										: renderValues()}
									<ChevronDown className="ml-2 h-4 w-4" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-[286px] bg-popover/50 shadow-md backdrop-blur-lg">
								{currentConfig?.type === "select" &&
									currentConfig?.form.options.map(
										(option) => (
											<DropdownMenuCheckboxItem
												key={option.value}
												checked={form
													.watch("values")
													.includes(
														option.value.toString(),
													)}
												onCheckedChange={() =>
													toggleCheck(
														option.value.toString(),
													)
												}
												onSelect={(e) =>
													e.preventDefault()
												}
												className={cn(
													optionVariants({
														color: option.color,
													}),
													"border-none bg-transparent",
												)}
											>
												<span className="flex items-center gap-1">
													{option.icon}
													{option.displayName}
												</span>
											</DropdownMenuCheckboxItem>
										),
									)}
							</DropdownMenuContent>
						</DropdownMenu>
						<Button
							variant="outline"
							className="rounded-none border-b-0 border-l-0 border-r-0 border-t bg-accent/25 !ring-0 focus:bg-accent/50"
							disabled={
								!form.formState.isDirty ||
								!form.formState.isValid
							}
						>
							Apply
						</Button>
					</form>
				</Form>
			</PopoverContent>
		</Popover>
	);
};

export default FilterMenu;
