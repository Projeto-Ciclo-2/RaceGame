import {
	IEntities,
	IPlayerControllable,
	IRoomActive,
} from "../../interfaces/IRoom";
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
	private selfRoom: IRoomActive | undefined;

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
		this.selfRoom = selfRoom;
		this.resolvePlayerMoveQueue();
	}

	public getEntities() {
		return this.mapController.getEntities(this.players);
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

	private broadcastGameState(entities: IEntities) {
		if (this.selfRoom) {
			for (const user of this.selfRoom.WsPlayers) {
				const message: WsGameState = {
					type: "gameState",
					entities: entities,
				};
				user.ws.send(JSON.stringify(message));
			}
		}
	}

	private resolvePlayerMoveQueue() {
		for (const move of this.moveQueue) {
			const pIndex = this.players.findIndex(
				(p) => move.player.id === p.id
			);
			if (pIndex !== -1) {
				const oldPlayer = this.players[pIndex];
				oldPlayer.carController.setKeys(move.keys);

				this.players[pIndex] =
					oldPlayer.carController.getFutureSelf(oldPlayer);

				const entities = this.mapController.updateEntitiesState(
					this.players
				);

				const { x, y, velocities: v } = oldPlayer;
				const {
					x: newX,
					y: newY,
					velocities: newV,
				} = entities.players[pIndex];

				const positionChanged = x !== newX || y !== newY;
				const velocitiesChanged = v.vx !== newV.vx || v.vy !== newV.vy;

				if (positionChanged || velocitiesChanged) {
					this.players[pIndex].moveNumber =
						this.players[pIndex].moveNumber + 1;

					const { vx, vy } = newV;
					console.log("(new velocity)");
					console.log(
						`(${this.players[pIndex].moveNumber}) [x, y] [${newX} ${newY}] | [vx, vy] [${vx}, ${vy}]`
					);
					console.log("______________");
					this.broadcastGameState(entities);
				}
			} else {
				console.error(
					"error! um movimento foi atribuído à um player não encontrado."
				);
			}
			this.moveQueue.delete(move);
		}
	}

	private resolvePlayerPickItemQueue() {}

	private resolvePlayerUsesItem() {}

	private resolvePlayerArrives() {}
}
