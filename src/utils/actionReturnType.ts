type SuccessfulAction<T> = {
	data: T;
	error: null;
};

type FailedAction = {
	data: null;
	error: string;
};

export type ActionReturnType<T> = SuccessfulAction<T> | FailedAction;
