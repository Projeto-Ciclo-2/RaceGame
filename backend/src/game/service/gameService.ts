import {
	IEntities,
	IPlayer,
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
	public players: Array<IPlayerControllable> = [];
	private selfRoom: IRoomActive | undefined;

	private stated_at: number;
	// 5 minutes of duration
	private durationTime = 15 * 60 * 1000;
	private startDelay = 3 * 1000;

	public alive: boolean = true;
	public started = false;

	public winner = "Unknown";

	// 1 minute is the limit for a player stay without make move
	private maxTimeWithoutMove = 5 * 60 * 1000;

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
	public _addPlayer(player: IPlayerControllable, selfRoom: IRoomActive) {
		this.players.push(player);
		const entities = this.mapController.updateEntitiesState(this.players);
		this.broadcastGameState(entities);
	}

	public gameLoop(selfRoom: IRoomActive) {
		this.selfRoom = selfRoom;
		this.resolvePlayerMoveQueue();
		this.softDisableInactivePlayers();
		this.checkIfSomeoneWins();
		this.checkGameEndByTimeout();
	}

	public reconnectPlayer(player: IPlayerControllable): boolean {
		// const pIndex = this.players.findIndex((p) => p.id === player.id);
		// if (pIndex !== -1) {
		// 	const oldPlayer = this.players[pIndex];
		// 	this.players[pIndex] = {...oldPlayer};
		return true;
		// }
		// return false;
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
			const filteredPlayer: Array<IPlayer> = entities.players
				.filter((p) => p.alive)
				.map((p) => {
					return {
						alive: p.alive,
						checkpoint: p.checkpoint,
						disableArrow: p.disableArrow,
						done_laps: p.done_laps,
						height: p.height,
						id: p.id,
						items: p.items,
						pickedItems: p.pickedItems,
						lastMessageAt: p.lastMessageAt,
						moveNumber: p.moveNumber,
						nitroDirection: p.nitroDirection,
						nitroUsedAt: p.nitroUsedAt,
						ready: p.ready,
						rotation: p.rotation,
						username: p.username,
						usingNitro: p.usingNitro,
						velocities: p.velocities,
						width: p.width,
						x: p.x,
						y: p.y,
					};
				});
			for (const user of this.selfRoom.WsPlayers) {
				const message: WsGameState = {
					type: "gameState",
					entities: {
						items: entities.items,
						players: filteredPlayer,
					},
				};
				user.ws.send(JSON.stringify(message));
			}
		}
	}

	private customWsSend(user: WsUser, players: Array<IPlayer>): void {
		const tempPlayers = players.map((p) => {});
	}

	private resolvePlayerMoveQueue() {
		const now = Date.now();
		let changed = false;
		let entitiesToSend: null | IEntities = null;
		for (const move of this.moveQueue) {
			const pIndex = this.players.findIndex(
				(p) => move.player.id === p.id
			);
			if (pIndex !== -1) {
				if (!this.players[pIndex].alive) {
					this.players[pIndex].alive = true;
				}
				this.players[pIndex].lastMessageAt = now;

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
					changed = true;
					entitiesToSend = entities;
				}
			} else {
				console.error(
					"error! um movimento foi atribuído à um player não encontrado."
				);
			}
			this.moveQueue.delete(move);
		}
		if (changed && entitiesToSend) {
			this.broadcastGameState(entitiesToSend);
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
					this.winner = betterPlayer.username;
				} else {
					this.winner = "Nobody.";
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
				this.winner = betterPlayer.username;
			} else {
				this.winner = "Nobody.";
			}
		}
	}

	private softDisableInactivePlayers() {
		const now = Date.now();
		this.players = this.players.map((p) => {
			if (p.lastMessageAt) {
				const endDate = p.lastMessageAt + this.maxTimeWithoutMove;
				if (now >= endDate) {
					p.alive = false;
				}
			}
			return p;
		});
	}

	private resolvePlayerPickItemQueue() {}

	private resolvePlayerUsesItem() {}

	private resolvePlayerArrives() {}
}
