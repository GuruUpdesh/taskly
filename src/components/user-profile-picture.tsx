import React from "react";

import Image from "next/image";

type Props = {
	src: string;
	size?: number;
};

const UserProfilePicture = ({ src, size = 20 }: Props) => {
	return (
		<Image
			src={src}
			width={size}
			height={size}
			style={{ minWidth: `${size}px`, minHeight: `${size}px` }}
			className={`rounded-full`}
			alt=""
		/>
	);
};

export default UserProfilePicture;
