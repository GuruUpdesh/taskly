"use client";

import React, { useState, useEffect } from "react";

const Grid = () => {
	const [cols, setCols] = useState(0);
	const [rows, setRows] = useState(0);

	useEffect(() => {
		const main = document.querySelector("main");

		const handleResize = () => {
			if (main) {
				const size = 130; // Your size calculation base
				setCols(Math.floor(main.clientWidth / size));
				setRows(Math.floor(main.clientHeight / size));
			}
		};

		const resizeObserver = new ResizeObserver(handleResize);
		if (main) {
			resizeObserver.observe(main);
		}

		window.addEventListener("resize", handleResize);

		return () => {
			if (main) {
				resizeObserver.unobserve(main);
			}
			resizeObserver.disconnect();
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	function renderTiles(quantity: number) {
		return Array.from(Array(quantity)).map((tile, index) => {
			return (
				<div
					key={index}
					className="m-[1px] aspect-square bg-[#020817] opacity-75"
				/>
			);
		});
	}

	return (
		<div
			className="absolute top-0 z-10 grid h-full w-full overflow-hidden backdrop-blur-[200px]"
			style={{
				gridTemplateColumns: `repeat(${cols}, 1fr)`,
				gridTemplateRows: `repeat(${rows}, 1fr)`,
				gridGap: "1fr",
			}}
		>
			{renderTiles(cols * rows)}
		</div>
	);
};

export default Grid;
