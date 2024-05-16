import { updateOrder } from "../src/utils/order";

jest.mock("../src/env.mjs", () => ({
	env: {
		DATABASE_URL: process.env.TEST_DATABASE_URL,
		CRON_SECRET: "mock-cron-secret",
		TESTING: true,
	},
}));

test("updateOrder updates order", async () => {
	const taskOrder = new Map<number, number>();
	taskOrder.set(1, 2);
	taskOrder.set(2, 3);
	taskOrder.set(3, 4);
	taskOrder.set(4, 5);

	await expect(updateOrder(taskOrder)).resolves.toBeUndefined();
}, 20000);

test("updateOrder throws error if some tasks are currently being updated", async () => {
	const taskOrder = new Map<number, number>();
	taskOrder.set(1, 2);
	taskOrder.set(2, 3);
	taskOrder.set(3, 4);
	taskOrder.set(4, 5);

	await expect(updateOrder(taskOrder)).rejects.toThrow(
		"Some tasks are currently being updated",
	);
}, 30000);
