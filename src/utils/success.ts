import { toast } from "sonner";
export function successToast(message: string) {
	toast.success("Success", {
		description: message,
	});
}
