import { WsGameState } from "../../../interfaces/IWSMessages";
import { IPlayer as FrontIPlayer, IItems } from "../interfaces/gameInterfaces";
import { IPlayer as BackIPlayer } from "../../../interfaces/IRoom";

export class WebSocketHandler {
	public handleGameState(
		e: WsGameState,
		players: Array<FrontIPlayer>,
		items: Array<IItems>,
		username: string
	) {
		for (const player of e.entities.players) {
			const i = players.findIndex((p) => p.id === player.id);
			const frontPlayer = this.playerConverter(player, username);
			if (i === -1) {
				// outros usuários
				players.push(frontPlayer);
			} else {
				// este usuário
				const { x, y, moveNumber } = players[i];
				const {
					x: clientX,
					y: clientY,
					moveNumber: clientMoveNumber,
				} = frontPlayer;

				// console.log("backend");
				// console.log(x, y, moveNumber);
				// console.log("backend");
				// console.log(clientX, clientY, clientMoveNumber);
				// console.log("");


				if (moveNumber === clientMoveNumber) {
					if (x !== clientX || y !== clientY) {
						console.log("reconciliation");
					}
				}
				players[i] = frontPlayer;
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

	private playerConverter(p: BackIPlayer, username: string): FrontIPlayer {
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
			nitroParticles: [],
			//
			moveNumber: p.moveNumber,
			rotation: p.rotation,
			velocities: p.velocities,
			width: p.width,
			height: p.height,
			x: p.x,
			y: p.y,
		};
	}
}
