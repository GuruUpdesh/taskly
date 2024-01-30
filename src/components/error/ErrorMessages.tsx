"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { throwClientError } from "~/utils/errors";

function ErrorMessages() {
	const searchParams = useSearchParams();

	const [toastFired, setToastFired] = useState(false);

	const error = searchParams.get("error");

	useEffect(() => {
		if (error) {
			throwClientError(error);
		}
	}, [searchParams, error, toastFired]);

	useEffect(() => {
		setToastFired(true);
	}, []);
	return <div></div>;
}

export default ErrorMessages;
