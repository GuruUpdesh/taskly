type SucessfulAction<T> = {
	status: "success";
	data: T;
};

export type FailedAction = {
	status: "error";
	error: { message: string; description: string };
};

export type Action<T> = SucessfulAction<T> | FailedAction;
