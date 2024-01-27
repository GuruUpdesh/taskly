import Image from "next/image";
import React from "react";

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
			className="rounded-full"
			alt=""
		/>
	);
};

export default UserProfilePicture;
