"use client";

import React, { useEffect, useState } from "react";

import { UploadIcon } from "@radix-ui/react-icons";
import { type PutBlobResult } from "@vercel/blob";
import { Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { cn } from "~/lib/utils";

type Props = {
	urlCallback?: (url: string) => void;
};

const ImageUploadArea = ({ urlCallback }: Props) => {
	const [dynamicClassName, setDynamicClassName] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	async function upload(file: File) {
		setIsLoading(true);
		const promise = fetch(`/api/upload?filename=${file.name}`, {
			method: "POST",
			body: file,
		});

		toast.promise(promise, {
			loading: "Uploading...",
			success: "Uploaded",
			error: "Error uploading",
		});

		const response = await promise;

		const newBlob = (await response.json()) as PutBlobResult;
		console.log(newBlob);

		if (urlCallback) {
			urlCallback(newBlob.url);
		}

		setIsLoading(false);
	}

	const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
		noClick: true,
		maxFiles: 1,
		accept: {
			"image/jpeg": [],
			"image/png": [],
			"image/*": [".jpeg", ".png"],
		},
		maxSize: 4500000,
		onDragEnter: () => setDynamicClassName("border-blue-500"),
		onDragLeave: () => setDynamicClassName(""),
		disabled: isLoading,
	});

	useEffect(() => {
		const file = acceptedFiles[0];
		if (!file) return;
		setDynamicClassName("");

		if (file.size > 4500000) {
			toast.error("File size too large");
			return;
		}

		if (!file.type.includes("image")) {
			toast.error("File type not supported");
			return;
		}

		void upload(file);
	}, [acceptedFiles]);

	return (
		<div
			{...getRootProps()}
			className={cn(
				"relative col-span-2 flex flex-col items-center justify-center overflow-hidden rounded border border-dashed bg-background-dialog",
				dynamicClassName,
			)}
		>
			<input {...getInputProps()} />
			{isLoading ? (
				<>
					<Loader2 className="mb-2 h-6 w-6 animate-spin text-muted-foreground" />
					<p className="text-sm text-muted-foreground">
						Uploading...
					</p>
				</>
			) : (
				<>
					<UploadIcon className="mb-2 h-6 w-6 text-muted-foreground" />
					<button type="button" onClick={open}>
						Choose files or drag and drop
					</button>
					<p className="text-sm text-muted-foreground">
						Image (max 4.5MB, .jpeg, .png)
					</p>
				</>
			)}
		</div>
	);
};

export default ImageUploadArea;
