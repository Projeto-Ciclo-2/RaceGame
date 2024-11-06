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

	color: "1" | "2" | "3"

	ready: boolean;
	done_laps: number;
	checkpoint: checkPointOrder | 0;

	items: Array<IItems>;
	usingNitro: boolean;
	nitroUsedAt: number | null; //timestamp
	nitroDirection: {
		up: boolean;
		down: boolean;
		left: boolean;
		right: boolean;
	};
	nitroParticles: Array<IParticle>;

	rotation: rotation | number;

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
	order: checkPointOrder;
}

export interface IFinishLine extends IBox {
	checkpointsNeeded: number;
}

export interface IItems extends IBox {
	id: string;
	type: 1 | 2 | 3;
	velocity_effect: number;
}

export interface IParticle extends IBox {
	velocityX: number;
	velocityY: number;
	color: string;
	opacity: number;
}

export interface IEntities {
	players: Array<IPlayer>;
	items: Array<IItems>;
}
