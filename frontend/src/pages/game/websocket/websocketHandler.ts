import { WsGameState } from "../../../interfaces/IWSMessages";
import {
	IPlayer as FrontIPlayer,
	IItems,
	IPlayer,
} from "../interfaces/gameInterfaces";
import { IPlayer as BackIPlayer } from "../../../interfaces/IRoom";
import { ClientPrediction } from "../tools/clientPrediction";

export class WebSocketHandler {
	public handleGameState(
		e: WsGameState,
		players: Array<FrontIPlayer>,
		items: Array<IItems>,
		username: string
	) {
		for (const player of e.entities.players) {
			const i = players.findIndex((p) => p.id === player.id);
			const clientPlayer: IPlayer | undefined = players[i];
			const serverPlayer = this.playerConverter(
				player,
				clientPlayer,
				username
			);
			if (i === -1) {
				// outros usuários
				console.log("[pushing players]: " + serverPlayer.username);
				players.push(serverPlayer);
				//
			} else if (
				!clientPlayer.canControl ||
				clientPlayer.username !== username
			) {
				// todo: others players interpolation
				players[i] = serverPlayer;
			} else {
				const result = ClientPrediction.detectDiferences(
					clientPlayer,
					serverPlayer
				);

				if (result) {
					console.log(
						"need reconciliation - results greater than " +
							result.move +
							" will be in conflict queue"
					);
					console.log("have a see in moves array");
					console.log(JSON.stringify(clientPlayer.moves));

					clientPlayer.conflictQueue = clientPlayer.moves.filter(
						(m) => {
							if (m.move > result.move) {
								return m;
							}
							return undefined;
						}
					);
					clientPlayer.moves = [];
					clientPlayer.x = result.x;
					clientPlayer.y = result.y;
					clientPlayer.velocities.vx = result.velocities.vx;
					clientPlayer.velocities.vy = result.velocities.vy;
					clientPlayer.moveNumber = result.move;
					players[i] = clientPlayer;
					console.log("after reconciliation");
					console.log(
						players[i].moveNumber,
						players[i].x,
						players[i].y,
						players[i].velocities.vx,
						players[i].velocities.vy
					);
				} else {
					// console.log("else case, trying to delete move");
					if (players[i].moves.length > 1) {
						players[i].moves = players[i].moves.filter(
							(m) => serverPlayer.moveNumber <= m.move
						);
						// console.log("removed move " + serverPlayer.moveNumber);
						// console.log(players[i].moves);
					}
				}
			}
		}
		if (e.entities.items.length !== items.length) {
			items = [];
		}
		for (const item of e.entities.items) {
			const index = items.findIndex((i) => i.id === item.id);
			if (index === -1) {
				items[items.length] = item;
			} else {
				items[index] = item;
			}
		}
		return items;
	}

	private playerConverter(
		p: BackIPlayer,
		previousPlayer: IPlayer,
		username: string
	): FrontIPlayer {
		return {
			id: p.id,
			username: p.username,
			canControl: p.username === username,
			ready: p.ready,
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
}
