import { IPlayerControllable, IRoomActive } from "../../interfaces/IRoom";
import {
	WsBroadcastPlayerMove,
	WsGameState,
	WsPlayerArrives,
	WsPlayerMove,
	WsPlayerPicksItem,
	WsPlayerUsesItem,
} from "../../interfaces/IWSMessages";
import { CarController } from "../controller/carController";
import { MapController } from "../controller/mapController";

export class GameService {
	private moveQueue: Set<WsPlayerMove> = new Set();
	private pickItemQueue: Array<WsPlayerPicksItem> = [];
	private useItemQueue: Array<WsPlayerUsesItem> = [];
	private arrivesQueue: Array<WsPlayerArrives> = [];

	private mapController = new MapController();
	private players: Array<IPlayerControllable> = [];

	constructor(players: Array<IPlayerControllable>) {
		// if (players.length <= 0) {
		// 	throw new Error("Game service receive invalid players.");
		// }
		this.players = players;
	}

	/**
	 *
	 * @deprecated
	 */
	public _addPlayer(player: IPlayerControllable) {
		this.players.push(player);
	}

	public gameLoop(selfRoom: IRoomActive) {
		this.resolvePlayerMoveQueue();
		const res = this.mapController.updateEntities(this.players);

		for (const user of selfRoom.WsPlayers) {
			const message: WsGameState = {
				type: "gameState",
				entities: res,
			};
			user.ws.send(JSON.stringify(message));
		}
	}

	public queuePlayerMove(action: WsPlayerMove) {
		this.moveQueue.add(action);
	}

	public queuePlayerPickItem(action: WsPlayerPicksItem) {
		this.pickItemQueue.push(action);
	}

	public queuePlayerUsesItem(action: WsPlayerUsesItem) {
		this.useItemQueue.push(action);
	}

	public queuePlayerArrives(action: WsPlayerArrives) {
		this.arrivesQueue.push(action);
	}

	private resolvePlayerMoveQueue() {
		for (const move of this.moveQueue) {
			this.players = this.players.map((p) => {
				if (move.player.id === p.id) {
					p.carController.handleKeyPress(move.key, move.alive);
				}
				return p;
			});
			this.moveQueue.delete(move);
		}
	}

	private resolvePlayerPickItemQueue() {}

	private resolvePlayerUsesItem() {}

	private resolvePlayerArrives() {}
}
