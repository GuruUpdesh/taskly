type Props = {
	color: string | null;
};

const SidebarBackground = ({ color }: Props) => {
	return (
		<div className="pointer-events-none animate-fade-in">
			<div
				className="absolute top-[55px] -z-10 h-full w-full"
				style={{
					opacity: 0.25,
					backgroundSize: "100% 200%",
					background: `linear-gradient(transparent 35%, ${color ?? "transparent"})`,
				}}
			/>
			<div
				className="absolute top-[55px] -z-10 h-full w-full"
				style={{
					opacity: 0.15,
					backgroundSize: "100% 200%",
					background: `linear-gradient(${color ?? "transparent"}, transparent 25%)`,
				}}
			/>
		</div>
	);
};

export default SidebarBackground;
