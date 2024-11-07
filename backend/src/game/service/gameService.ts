import { IPlayerControllable, IRoomActive } from "../../interfaces/IRoom";
import { WsUser } from "../../interfaces/IUser";
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
	 * @deprecated
	 */
	public _addPlayer(player: IPlayerControllable, user: WsUser) {
		this.players.push(player);
		const entities = this.mapController.updateEntitiesState(this.players);
		const message: WsGameState = {
			type: "gameState",
			entities: entities,
		};
		user.ws.send(JSON.stringify(message));
	}

	public gameLoop(selfRoom: IRoomActive) {
		this.resolvePlayerMoveQueue();
		let changes = false;
		const newPlayers = this.players.map((p) => {
			return p.carController.getFutureSelf(p);
		});
		const entities = this.mapController.updateEntitiesState(newPlayers);
		this.players.forEach((p, i) => {
			const { x, y } = p;
			const { x: newX, y: newY } = entities.players[i];
			const positionChanged = x !== newX || y !== newY;
			if (positionChanged) {
				changes = true;
				this.players[i] = {
					...entities.players[i],
					carController: this.players[i].carController,
					moveNumber: entities.players[i].moveNumber++,
				};
				// console.log("==moveNumber: " + this.players[i].moveNumber);
			}
		});

		if (changes) {
			for (const user of selfRoom.WsPlayers) {
				const message: WsGameState = {
					type: "gameState",
					entities: entities,
				};
				user.ws.send(JSON.stringify(message));
			}
		}
	}

	public queuePlayerMove(action: WsPlayerMove) {
		this.moveQueue.add(action);
	}

	public queuePlayerPickItem(action: WsPlayerPicksItem) {
		// this.pickItemQueue.push(action);
	}

	public queuePlayerUsesItem(action: WsPlayerUsesItem) {
		// this.useItemQueue.push(action);
	}

	public queuePlayerArrives(action: WsPlayerArrives) {
		// this.arrivesQueue.push(action);
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
