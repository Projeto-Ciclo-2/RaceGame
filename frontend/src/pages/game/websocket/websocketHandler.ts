import { WsGameState } from "../../../interfaces/IWSMessages";
import { IPlayer as FrontIPlayer } from "../interfaces/gameInterfaces";
import { IPlayer as BackIPlayer} from "../../../interfaces/IRoom";

export class WebSocketHandler {
	public handleGameState(e: WsGameState, players: Array<FrontIPlayer>, username: string) {
		for (const player of e.entities.players) {
			const i = players.findIndex(p => p.id === player.id);
			const frontPlayer = this.playerConverter(player, username);
			if(i === -1) {
				players.push(frontPlayer);
			} else {
				players[i] = frontPlayer;
			}
		}
	}

	private playerConverter(p: BackIPlayer, username: string) : FrontIPlayer {
		return {
			id: p.id,
			username: p.username,
			canControl: p.username === username,
			ready: p.ready,
			//
			color: "1",
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
			rotation: p.rotation,
			velocities: p.velocities,
			width: p.width,
			height: p.height,
			x: p.x,
			y: p.y
		}
	}
}
