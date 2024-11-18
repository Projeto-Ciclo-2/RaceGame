import { IPlayer as BackIPlayer, IPlayerMIN } from "../../../interfaces/IRoom";
import {
	IPlayer as FrontIPlayer,
	IItems,
	IMoves,
	IOtherPlayer,
} from "../interfaces/gameInterfaces";

export function playerConverter(
	p: BackIPlayer | IPlayerMIN,
	previousPlayer: FrontIPlayer | IOtherPlayer | undefined,
	username: string
): FrontIPlayer {
	let disableArrow = {
		up: false,
		down: false,
		left: false,
		right: false,
	};
	let items: IItems[] = [];
	let nitroUsedAt: number | null = null;
	let moveNumber = 0;
	let rotationAcceleration = 0;
	let velocities = {
		vx: 0,
		vy: 0,
	};

	const playerKeys = Object.keys(p);
	if (
		playerKeys.includes("disableArrow") &&
		playerKeys.includes("items") &&
		playerKeys.includes("nitroUsedAt") &&
		playerKeys.includes("moveNumber") &&
		playerKeys.includes("rotationAcceleration") &&
		playerKeys.includes("velocities")
	) {
		const tempP = p as BackIPlayer;
		disableArrow = tempP.disableArrow;
		items = tempP.items;
		nitroUsedAt = tempP.nitroUsedAt;
		moveNumber = tempP.moveNumber;
		rotationAcceleration = tempP.rotationAcceleration;
		velocities = tempP.velocities;
	}

	let conflictQueue: Array<IMoves> = [];
	let moves: Array<IMoves> = [];

	if (previousPlayer) {
		const keys = Object.keys(previousPlayer);
		const x = previousPlayer as FrontIPlayer;
		if (keys.includes("moves")) {
			moves = x.moves;
		}
		if (keys.includes("conflictQueue")) {
			conflictQueue = x.conflictQueue;
		}
	}
	return {
		username: p.username,
		canControl: p.username === username,
		carID: p.carID,
		ready: true, //assuming its no necessary
		//
		alive: true,
		lastMessageAt: undefined,
		//
		checkpoint: p.checkpoint,
		done_laps: p.done_laps,
		disableArrow: disableArrow,
		//
		items: items,
		nitroUsedAt: nitroUsedAt,
		usingNitro: p.usingNitro,
		nitro: previousPlayer ? previousPlayer.nitro : [],
		nitroParticles: previousPlayer ? previousPlayer.nitroParticles : [],
		//
		moveNumber: moveNumber,
		moves: moves,
		conflictQueue: conflictQueue,
		//
		rotation: p.rotation,
		rotationAcceleration: rotationAcceleration,
		//
		velocities: velocities,
		width: p.width,
		height: p.height,
		x: p.x,
		y: p.y,
	};
}

export function otherPlayerConverter(
	player: FrontIPlayer,
	toX: number,
	toY: number
): IOtherPlayer {
	return {
		canControl: false,
		carID: player.carID,
		checkpoint: player.checkpoint,
		done_laps: player.done_laps,
		nitro: player.nitro,
		nitroParticles: player.nitroParticles,
		rotation: player.rotation,
		username: player.username,
		usingNitro: player.usingNitro,
		x: player.x,
		y: player.y,
		toX: toX,
		toY: toY,
		height: player.height,
		width: player.width,
	};
}
