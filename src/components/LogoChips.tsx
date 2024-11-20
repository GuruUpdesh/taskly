const LogoChips = () => {
	const phi = 1.418034;

	const sizes = {
		green: Math.pow(phi, 3),
		yellow: Math.pow(phi, 2),
		red: phi,
		purple: 1,
	};

	return (
		<div className="absolute bottom-[3px] flex h-[3px] w-[60px] gap-[1px]">
			<div
				className="h-[3px] rounded-full bg-indigo-600 backdrop-blur-2xl"
				style={{ flex: sizes.purple }}
			/>
			<div
				className="h-[3px] rounded-full bg-red-600 backdrop-blur-2xl"
				style={{ flex: sizes.red }}
			/>
			<div
				className="h-[3px] rounded-full bg-yellow-600 backdrop-blur-2xl"
				style={{ flex: sizes.yellow }}
			/>
			<div
				className="h-[3px] rounded-full bg-green-600 backdrop-blur-2xl"
				style={{ flex: sizes.green }}
			/>
		</div>
	);
};

export default LogoChips;
