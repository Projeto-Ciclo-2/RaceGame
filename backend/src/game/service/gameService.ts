import {
	IEntities,
	IPlayerControllable,
	IRoomActive,
} from "../../interfaces/IRoom";
import { WsUser } from "../../interfaces/IUser";
import {
	WsBroadcastPlayerMove,
	WsEndGame,
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

	private stated_at: number;
	// 5 minutes of duration
	private durationTime = 5 * 60 * 1000;
	public alive: boolean = true;

	constructor(players: Array<IPlayerControllable>) {
		// if (players.length <= 0) {
		// 	throw new Error("Game service receive invalid players.");
		// }
		this.players = players;
		this.stated_at = Date.now();
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
		this.checkIfSomeoneWins();
		this.checkGameEndByTimeout();
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

	private broadcastGameEnd(winner: string) {
		const msg: WsEndGame = {
			type: "endGame",
			players: this.players,
			roomID: this.selfRoom!.id,
			winner: winner,
		};
		for (const p of this.selfRoom!.WsPlayers) {
			p.ws.send(JSON.stringify(msg));
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

	private checkIfSomeoneWins() {
		if (this.selfRoom) {
			let betterPlayer: IPlayerControllable | undefined;
			for (const player of this.players) {
				if (player.done_laps >= this.selfRoom.laps) {
					console.log(
						"have a look, this bro ends the game: " +
							player.username
					);
					this.alive = false;
					betterPlayer = player;
				}
			}
			if (!this.alive) {
				if (betterPlayer) {
					this.broadcastGameEnd(betterPlayer.username);
				} else {
					this.broadcastGameEnd("Nobody.");
				}
			}
		}
	}

	private sortPlayers(): Array<IPlayerControllable> {
		return this.players.sort((a, b) => {
			if (a.done_laps > b.done_laps) return 1;

			if (b.done_laps > a.done_laps) return -1;

			if (a.checkpoint > b.checkpoint) return 1;

			if (b.checkpoint > a.checkpoint) return -1;

			return 0;
		});
	}

	private checkGameEndByTimeout() {
		const now = Date.now();
		const endDate = this.stated_at + this.durationTime;
		if (now >= endDate) {
			console.log("end by timeout");
			this.alive = false;
			const sortedPlayers = this.sortPlayers();
			const betterPlayer = sortedPlayers[sortedPlayers.length - 1];
			if (betterPlayer) {
				this.broadcastGameEnd(betterPlayer.username);
			} else {
				this.broadcastGameEnd("Nobody.");
			}
		}
	}

	private resolvePlayerPickItemQueue() {}

	private resolvePlayerUsesItem() {}

	private resolvePlayerArrives() {}
}
