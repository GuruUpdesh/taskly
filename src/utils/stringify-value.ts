// Ensures any value is returned as a string
export const stringifyValue = (value: string | number | null): string => {
	if (value === null || value === undefined) {
		console.warn("PropertySelect: Value is null or undefined");
		return "unknown";
	}
	return value.toString();
};
