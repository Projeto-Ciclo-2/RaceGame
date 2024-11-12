import { IPlayer as BackIPlayer } from "../../../interfaces/IRoom";
import { IPlayer as FrontIPlayer } from "../interfaces/gameInterfaces";

export function playerConverter(
	p: BackIPlayer,
	previousPlayer: FrontIPlayer | undefined,
	username: string
): FrontIPlayer {
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
		nitroParticles: previousPlayer ? previousPlayer.nitroParticles : [],
		//
		moveNumber: p.moveNumber,
		moves: previousPlayer ? previousPlayer.moves : [],
		conflictQueue: previousPlayer ? previousPlayer.conflictQueue : [],
		//
		rotation: p.rotation,
		velocities: p.velocities,
		width: p.width,
		height: p.height,
		x: p.x,
		y: p.y,
	};
}
