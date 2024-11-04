import React from "react";
import { GameController } from "./gameController";
import "./game.css";
import bkg from "./assets/map1.svg";
import car from "./assets/blue-car.svg";

export default function Game() {
	const gameController = React.useRef<null | GameController>(null);
	const canvas = React.useRef<null | HTMLCanvasElement>(null);

	React.useEffect(() => {
		if (!gameController.current) {
			const loadImage = (src: string): Promise<HTMLImageElement> => {
				return new Promise((resolve, reject) => {
					const img = new Image();
					img.src = src;
					img.onload = () => resolve(img);
					img.onerror = (error) => reject(error);
				});
			};

			// Load both images
			Promise.all([loadImage(bkg), loadImage(car)])
				.then(([bkgImg, carImg]) => {
					if (canvas.current) {
						gameController.current = new GameController(
							canvas.current,
							bkgImg,
							carImg
						);
						gameController.current.start();
					}
				})
				.catch((error) => {
					console.error("Failed to load images:", error);
				});
		}
	}, []);


	return (
		<div id="game">
			<canvas ref={canvas} width={760} height={600}></canvas>
		</div>
	);
}
