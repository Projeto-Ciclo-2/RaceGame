import { carOptions, IPlayer, IPlayerControllable, IRoomActive } from "../interfaces/IRoom";
import { WsUser } from "../interfaces/IUser";
import {
	WsEndGame,
	WsPlayerArrives,
	WsPlayerMove,
	WsPlayerPicksItem,
	WsPlayerUsesItem,
} from "../interfaces/IWSMessages";
import RoomService from "../services/roomService";
import { UserService } from "../services/userService";
import { CarController } from "./controller/carController";
import { getPlayerControllable } from "./mock/playerControllable";

export class RaceGame {
	private gameRooms: Array<IRoomActive> = [];
	private fps = 30;
	private interval = 1000 / this.fps;
	private roomService = new RoomService();
	private usersService = new UserService();

	private triggerDeleteRoom(e: WsEndGame) {
		console.log("trigger deleteRoom");

		this.deleteRoomFn(e);
	}
	private deleteRoomFn: (e: WsEndGame) => void = (e: WsEndGame) => {};
	public onDeleteRoom = (cbFn: (e: WsEndGame) => void) => {
		console.log("fn seated");

		this.deleteRoomFn = cbFn;
	};

	constructor() {
		setInterval(() => {
			this.triggerGameLoop();
		}, this.interval);
	}

	/** not recommend
	 * @deprecated
	 */
	public _addPlayer(wsPlayer: WsUser, player: IPlayer, roomID: string, carID: carOptions) {
		this.gameRooms = this.gameRooms.map((r) => {
			if (r.id === roomID) {
				r.players.push(player);
				r.WsPlayers.push(wsPlayer);
				r.gameService._addPlayer(
					getPlayerControllable(player.id, player.username, true, carID),
					r
				);
			}
			return r;
		});
	}

	public addRoom(room: IRoomActive) {
		this.gameRooms.push(room);
	}

	public getRoom(id: string) {
		return this.gameRooms.find((room) => room.id === id);
	}

	public reconnectPlayer(
		roomID: string,
		wsPlayer: WsUser,
		userID: string,
		carID: carOptions
	): boolean {
		const room = this.getRoom(roomID);
		if (room) {
			const success = room.gameService.reconnectPlayer(
				getPlayerControllable(userID, wsPlayer.username, true, carID)
			);
			if (success) {
				const wsIndex = room.WsPlayers.findIndex(
					(p) => p.username === wsPlayer.username
				);
				if (wsIndex !== -1) {
					room.WsPlayers[wsIndex] = wsPlayer;
				} else {
					throw new Error("player was not found!");
				}
			}
		}
		return false;
	}

	public setThisPlayerReady(
		roomID: string,
		wsPlayer: WsUser
	) {
		const room = this.getRoom(roomID);
		if (room) {
			room.gameService.players = room.gameService.players.map((p) => {
				if (p.username === wsPlayer.username) {
					p.ready = true;
				}
				return p;
			});
		}
	}

	public queuePlayerMove(action: WsPlayerMove) {
		for (const room of this.gameRooms) {
			if (room.id === action.roomID) {
				room.gameService.queuePlayerMove(action);
			}
		}
	}

	public queuePlayerPickItem(action: WsPlayerPicksItem) {
		for (const room of this.gameRooms) {
			if (room.id === action.roomID) {
				room.gameService.queuePlayerPickItem(action);
			}
		}
	}

	public queuePlayerUsesItem(action: WsPlayerUsesItem) {
		for (const room of this.gameRooms) {
			if (room.id === action.roomID) {
				room.gameService.queuePlayerUsesItem(action);
			}
		}
	}

	public queuePlayerArrives(action: WsPlayerArrives) {
		for (const room of this.gameRooms) {
			if (room.id === action.roomID) {
				room.gameService.queuePlayerArrives(action);
			}
		}
	}

	private async triggerGameLoop() {
		for (const room of this.gameRooms) {
			room.gameService.gameLoop(room);
			if (!room.gameService.alive) {
				const index = this.gameRooms.findIndex((r) => r.id === room.id);
				if (index === -1) {
					console.error("dude, something get really wrong.");
					console.log(
						"was not possible to remove a room from game rooms."
					);
				} else {
					this.gameRooms.splice(index, 1);
				}
				await this.roomService.deleteRoom(room.id);
				const msg: WsEndGame = {
					type: "endGame",
					players: room.gameService.players,
					roomID: room.id,
					winner: room.gameService.winner,
				};
				this.triggerDeleteRoom(msg);
				this.updateUsersScore(
					room.gameService.players,
					room.gameService.winner,
					room
				);
			}
		}
	}

	private async updateUsersScore(
		players: Array<IPlayerControllable>,
		winner: string,
		room: IRoomActive
	) {
		const msgs = room.messages;
		for (const player of players) {
			const { id, username, pickedItems } = player;
			const { length: msgQntd } = msgs.filter(
				(m) => m.username === username
			);
			const win = username === winner;

			const user = await this.usersService.getUserById(id);
			if (user) {
				this.usersService.update(id, {
					messages_send: user.messages_send + msgQntd,
					picked_items: user.picked_items + pickedItems,
					played_games: user.played_games + 1,
					wins: user.wins + (win ? 1 : 0),
				});
			}
		}
	}
}
