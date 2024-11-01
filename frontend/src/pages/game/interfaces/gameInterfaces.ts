export type typeOptions = "ArrowRight" | "ArrowLeft" | "ArrowUp" | "ArrowDown";
export type rotation = 0 | 45 | 90 | 135 | 180 | 235 | 270 | 315;

export interface IPlayer {
	canControl: boolean;
	rotation: rotation;
	x: number;
	y: number;

	width: number;
	height: number;
	defaultWidth: number;
	defaultHeight: number;

	velocities: {
		up: number;
		down: number;
		left: number;
		right: number;
	}
}

export interface IBox {
	x: number;
	y: number;
	width: number;
	height: number;
}
