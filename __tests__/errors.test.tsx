import { throwServerError, throwClientError } from "../src/utils/errors";

import { toast } from "sonner";

test("throwServerError throws an error", () => {
	expect(() => throwServerError("test")).toThrowError("test");
});

test("throwClientError throws an error", () => {
	const spy = jest.spyOn(toast, "error");
	throwClientError("test");
	expect(toast.error).toHaveBeenCalled();
});
