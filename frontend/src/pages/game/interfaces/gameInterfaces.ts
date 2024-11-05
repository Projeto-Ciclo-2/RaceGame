export type typeOptions = "ArrowRight" | "ArrowLeft" | "ArrowUp" | "ArrowDown";
export type rotation = 0 | 45 | 90 | 135 | 180 | 235 | 270 | 315;
type checkPointOrder = 1 | 2 | 3 | 4 | 5;

export interface IBox {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface IPlayer extends IBox {
	id: string;
	username: string;
	canControl: boolean;

	ready: boolean;
	done_laps: number;
	checkpoint: checkPointOrder | 0;

	items: Array<IItems>;

	rotation: rotation;

	defaultWidth: number;
	defaultHeight: number;

	velocities: {
		vx: number;
		vy: number;
	};

	disableArrow: {
		up: boolean;
		down: boolean;
		left: boolean;
		right: boolean;
	};
}

export interface ICheckPoint extends IBox {
	order: checkPointOrder
}

export interface IFinishLine extends IBox {
	checkpointsNeeded: number;
}

export interface IItems extends IBox {
	id: string;
	velocity_effect: number;
}

export interface IEntities {
	players: Array<IPlayer>;
	items: Array<IItems>;
}
