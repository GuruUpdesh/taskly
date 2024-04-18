import React from "react";

import Image from "next/image";

type Props = {
	src: string;
	size?: number;
};

const UserProfilePicture = ({ src, size = 20 }: Props) => {
	return (
		<div
			style={{ minWidth: `${size}px`, minHeight: `${size}px` }}
			className="relative aspect-square"
		>
			<Image
				src={src}
				fill
				style={{ objectFit: "cover" }}
				className="rounded-full"
				alt=""
			/>
		</div>
	);
};

export default UserProfilePicture;
