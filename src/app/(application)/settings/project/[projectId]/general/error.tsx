"use client";

import { useEffect } from "react";
import Message from "~/components/general/message";
import { Button } from "~/components/ui/button";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div>
			<Message
				type="error"
				description={
					<div className="my-4">
						<Button
							onClick={
								// Attempt to recover by trying to re-render the segment
								() => reset()
							}
						>
							Try again
						</Button>
					</div>
				}
			>
				<p>Something went wrong!</p>
			</Message>
		</div>
	);
}
