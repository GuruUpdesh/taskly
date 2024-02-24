import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Plus } from "lucide-react";
import pluralize from "pluralize";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
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
	taskConfig,
} from "~/config/task-entity";
import { cn } from "~/lib/utils";
import { useAppStore, type Filter } from "~/store/app";
import { Form, FormField, FormItem } from "../ui/form";

type Props = {
	containerClass: string;
};

const AddFilter = ({ containerClass }: Props) => {
	const [open, setOpen] = React.useState(false);
	const properties = Object.keys(taskConfig) as (keyof typeof taskConfig)[];
	const [assignees, sprints, addFilter] = useAppStore((state) => [
		state.assignees,
		state.sprints,
		state.addFilter,
	]);

	const formSchema = z.object({
		property: z.string(),
		is: z.boolean(),
		values: z.array(z.string()).min(1),
	});

	const form = useForm<Filter>({
		resolver: zodResolver(formSchema),
		mode: "onChange",
		defaultValues: {
			property: "",
			is: true,
			values: [],
		},
	});

	useEffect(() => {
		form.setValue("values", []);
	}, [form.watch("property")]);

	function toggleCheck(val: string) {
		const values = form.getValues("values");
		if (values.includes(val)) {
			form.setValue(
				"values",
				values.filter((v) => v !== val),
			);
		} else {
			form.setValue("values", [...values, val]);
		}
	}

	const selectValueRef = useRef<HTMLButtonElement>(null);

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
		addFilter(values);
		setOpen(false);
	}

	const renderValues = useCallback(() => {
		if (!currentConfig || currentConfig.type !== "select") return null;

		const values = form.watch("values");
		const options = currentConfig.form.options;
		const pluralProperty = pluralize(currentConfig.displayName);

		return (
			<div className="flex items-center gap-2 mix-blend-screen">
				{values.map((value) => {
					const option = options.find(
						(option) => option.value === value,
					);
					if (!option) return null;

					return (
						<div
							key={option.value}
							className={cn(
								optionVariants({ color: option.color }),
								values.length === 1
									? "flex gap-1 !bg-transparent"
									: "pointer-events-none -m-1.5 flex gap-1 rounded-full bg-background p-1",
							)}
						>
							{option.icon}
							{values.length === 1 ? (
								<p className="ml-1">{option.displayName}</p>
							) : null}
						</div>
					);
				})}
				{values.length > 1 ? (
					<div className="flex items-center gap-1">
						<p>{values.length}</p>
						<p>{pluralProperty}</p>
					</div>
				) : null}
			</div>
		);
	}, [form.watch("values"), currentConfig]);

	return (
		<Popover open={open} onOpenChange={(open) => setOpen(open)}>
			<PopoverTrigger asChild>
				<button
					className={cn(containerClass, {
						"bg-accent text-white": open,
					})}
				>
					<Plus className="h-4 w-4" />
				</button>
			</PopoverTrigger>
			<PopoverContent className="overflow-hidden rounded-lg bg-background/75 p-0 backdrop-blur-xl">
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
											{properties.map((property) => {
												const config =
													getTaskConfig(property);

												if (config.type !== "select")
													return null;

												return (
													<SelectItem
														key={config.value}
														value={config.value}
														className="flex items-center justify-between space-x-2 !pl-2 focus:bg-accent/50"
													>
														<div className="flex min-w-[8rem] items-center gap-2">
															<span>
																{config.icon}
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
								className={cn(
									"rounded-none border-none bg-accent/25 !ring-0 focus:ring-0",
									{
										"bg-accent": form.watch("is"),
									},
								)}
								onClick={() => form.setValue("is", true)}
							>
								Is
							</Button>
							<Button
								type="button"
								variant="outline"
								className={cn(
									"rounded-none border-none bg-accent/25 !ring-0 focus:ring-0",
									{
										"bg-accent": !form.watch("is"),
									},
								)}
								onClick={() => form.setValue("is", false)}
							>
								Is not
							</Button>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger
								asChild
								disabled={form.watch("property") === ""}
							>
								<button
									ref={selectValueRef}
									className="flex  h-10 w-full max-w-[400px] items-center justify-between whitespace-nowrap rounded-none border-b-0 border-l-0 border-r-0 border-t bg-accent/25 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground hover:bg-accent/50 focus:bg-accent/50 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								>
									{form.watch("values").length === 0
										? "Select value..."
										: renderValues()}
									<ChevronDown className="ml-2 h-4 w-4" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="bg-popover/50 shadow-md backdrop-blur-lg"
								style={{
									width: selectValueRef.current
										? selectValueRef.current.offsetWidth
										: "",
								}}
							>
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
							type="button"
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

export default AddFilter;
