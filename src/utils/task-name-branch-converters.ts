export function taskNameToBranchName(taskName: string) {
	return taskName
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "");
}
