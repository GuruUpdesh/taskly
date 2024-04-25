import React from "react";

type Props = {
	visible: boolean;
	children: React.ReactNode;
};

const Step = ({ visible, children }: Props) => {
	if (visible) {
		return <>{children}</>;
	}
	return null;
};

export default Step;
