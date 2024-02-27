import { useEffect } from "react";

import { type FieldErrors } from "react-hook-form";
import { toast } from "sonner";

/**
 * Hook to display toast notifications for react-hook-form validation errors.
 * @param errors - Object containing potential validation errors from react-hook-form.
 */
function useValidationErrors(errors: FieldErrors) {
	useEffect(() => {
		Object.entries(errors).forEach(([key, error]) => {
			if (error && typeof error.message === "string") {
				const errorMessage = `${error.message} ${key ? `(Field: ${key})` : ""}`;
				toast.error(`Invalid form data: ${key}`, {
					description: errorMessage,
				});
			}
		});
	}, [errors]);
}

export default useValidationErrors;
