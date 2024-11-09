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
				console.log(serverPlayer.moveNumber);
				players.push(serverPlayer);
			} else {
				// este usuário
				// const { x, y, moveNumber } = serverPlayer;
				// const {
				// 	x: clientX,
				// 	y: clientY,
				// 	moveNumber: clientMoveNumber,
				// } = clientPlayer;

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
					console.log(clientPlayer.moves);

					clientPlayer.conflictQueue = clientPlayer.moves.filter(
						(m) => m.move > result.move
					);
					clientPlayer.moves = [];
					clientPlayer.x = result.x;
					clientPlayer.y = result.y;
					clientPlayer.velocities.vx = result.velocities.vx;
					clientPlayer.velocities.vy = result.velocities.vy;
					players[i] = clientPlayer;
					console.log(players[i].conflictQueue);
				} else {
					players[i].moves = players[i].moves.filter(
						(m) => serverPlayer.moveNumber !== m.move
					);
					// console.log("removed move " + serverPlayer.moveNumber);
					// console.log(players[i].moves);
				}
			}
		}
		for (const item of e.entities.items) {
			const index = items.findIndex((i) => i.id === item.id);
			if (index === -1) {
				items.push(item);
				return;
			}
			items[index] = item;
		}
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
