import { IPlayer as BackIPlayer } from "../../../interfaces/IRoom";
import {
	IPlayer as FrontIPlayer,
	IMoves,
	IOtherPlayer,
} from "../interfaces/gameInterfaces";

export function playerConverter(
	p: BackIPlayer,
	previousPlayer: FrontIPlayer | IOtherPlayer | undefined,
	username: string
): FrontIPlayer {
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
		id: p.id,
		username: p.username,
		canControl: p.username === username,
		ready: p.ready,
		//
		alive: p.alive,
		lastMessageAt: p.lastMessageAt,
		//
		color: p.username === username ? "1" : "3",
		//
		checkpoint: p.checkpoint,
		done_laps: p.done_laps,
		disableArrow: p.disableArrow,
		//
		items: p.items,
		nitroDirection: p.nitroDirection,
		nitroUsedAt: p.nitroUsedAt,
		usingNitro: p.usingNitro,
		nitro: previousPlayer ? previousPlayer.nitro : [],
		nitroParticles: previousPlayer ? previousPlayer.nitroParticles : [],
		//
		moveNumber: p.moveNumber,
		moves: moves,
		conflictQueue: conflictQueue,
		//
		rotation: p.rotation,
		rotationAcceleration: p.rotationAcceleration,
		//
		velocities: p.velocities,
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
		alive: player.alive,
		canControl: player.canControl,
		checkpoint: player.checkpoint,
		color: player.color,
		done_laps: player.done_laps,
		id: player.id,
		nitroDirection: player.nitroDirection,
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
		width: player.width
	};
}
