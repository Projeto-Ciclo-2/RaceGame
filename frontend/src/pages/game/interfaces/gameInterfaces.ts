import { carOptions } from "../../../interfaces/IAssets";

export type rotation = 0 | 45 | 90 | 135 | 180 | 235 | 270 | 315;
type checkPointOrder = 1 | 2 | 3 | 4 | 5;

export interface IBox {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface IPlayer extends IBox {
	username: string;
	canControl: boolean;
	carID: carOptions;

	alive: boolean;
	lastMessageAt: undefined | number; //timestamp

	ready: boolean;
	done_laps: number;
	checkpoint: checkPointOrder | 0;

	items: Array<IItems>;
	usingNitro: boolean;
	nitroUsedAt: number | null; //timestamp

	nitro: Array<INitroParticle>;
	nitroParticles: Array<IParticle>;

	moveNumber: number;
	moves: Array<IMoves>;
	conflictQueue: Array<IMoves>;

	rotation: rotation | number;
	rotationAcceleration: number;

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

export interface IOtherPlayer {
	username: string;
	carID: carOptions;
	canControl: false;
	done_laps: number;
	checkpoint: checkPointOrder | 0;

	usingNitro: boolean;

	nitro: Array<INitroParticle>;
	nitroParticles: Array<IParticle>;

	rotation: rotation | number;

	x: number;
	y: number;
	toX: number;
	toY: number;
	width: number;
	height: number;
}

export interface IMoves {
	move: number;
	x: number;
	y: number;
	rotation: number;
	rotationAcceleration: number;
	itemsAmount: number;
	velocities: {
		vx: number;
		vy: number;
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

export interface IDeletedItem extends IBox {
	ttl: number;
	particles: Array<IParticle>;
	id: string;
}

export interface IParticle extends IBox {
	velocityX: number;
	velocityY: number;
	color: string;
	opacity: number;
}

export interface INitroParticle {
	x: number;
	y: number;
	radius: number;
	hue: number;
}

export interface IEntities {
	players: Array<IPlayer>;
	items: Array<IItems>;
}
