import { IPlayer, IPlayerControllable, IRoomActive } from "../interfaces/IRoom";
import { WsUser } from "../interfaces/IUser";
import {
	WsPlayerArrives,
	WsPlayerMove,
	WsPlayerPicksItem,
	WsPlayerUsesItem,
} from "../interfaces/IWSMessages";
import RoomService from "../services/roomService";
import { CarController } from "./controller/carController";
import { getPlayerControllable } from "./mock/playerControllable";

export class RaceGame {
	private gameRooms: Array<IRoomActive> = [];
	private fps = 30;
	private interval = 1000 / this.fps;
	private roomService = new RoomService();

	constructor() {
		setInterval(() => {
			this.triggerGameLoop();
		}, this.interval);
	}

	/** not recommend
	 * @deprecated
	 */
	public _addPlayer(wsPlayer: WsUser, player: IPlayer, roomID: string) {
		this.gameRooms = this.gameRooms.map((r) => {
			if (r.id === roomID) {
				r.players.push(player);
				r.WsPlayers.push(wsPlayer);
				r.gameService._addPlayer(
					getPlayerControllable(player.id, player.username, true),
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
				console.log("roomservice deleted room. [id] " + room.id);
				const rooms = await this.roomService.allRooms();
			}
		}
	}
}
