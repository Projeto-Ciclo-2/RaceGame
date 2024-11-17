import { CarController } from "../game/controller/carController";
import { GameService } from "../game/service/gameService";
import { WsUser } from "./IUser";

type checkPointOrder = 1 | 2 | 3 | 4 | 5;
type carOptions = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface IBox {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface IPlayer extends IBox {
	id: string;
	username: string;
	carID: carOptions;
	alive: boolean;
	lastMessageAt: undefined | number; //timestamp

	ready: boolean;

	done_laps: number;
	checkpoint: checkPointOrder | 0;

	items: Array<IItems>;
	pickedItems: number;

	usingNitro: boolean;
	nitroUsedAt: number | null; //timestamp

	moveNumber: number;

	x: number;
	y: number;

	width: number;
	height: number;

	rotation: number;
	rotationAcceleration: number;

	velocities: {
		vx: number;
		vy: number;
	};

	disableArrow: {
		up: boolean;
		down: boolean;
		left: boolean;
		right: boolean;
	};
}

export interface IPlayerMIN extends IBox {
	user: string;
	carID: carOptions;
	canControl: false;
	lapsDone: number;
	checkpoint: checkPointOrder | 0;
	usingNitro: boolean;
	rotation: number;
}

export interface IPlayerControllable extends IPlayer {
	carController: CarController;
}

export interface ICheckPoint extends IBox {
	order: checkPointOrder;
}

export interface IFinishLine extends IBox {
	checkpointsNeeded: number;
}

export interface IItems extends IBox {
	id: string;
	type: 1 | 2 | 3;
	velocity_effect: number;
}

export interface IEntitiesForBroadcast {
	players: Array<IPlayer | IPlayerMIN>;
	items: Array<IItems>;
}

export interface IEntities {
	players: Array<IPlayer>;
	items: Array<IItems>;
}

//
//
//

export interface IMessage {
	content: string;
	username: string;
	userID: string;
	typeMessageChat: "message" | "userJoined" | "userLeft" | "userReady";
}

export interface IRoom {
	id: string;
	laps: number;
	map: 1;
	players: Array<IPlayer>;
	messages: Array<IMessage>;
	gameInit: boolean;
}

export interface IRoomActive extends IRoom {
	WsPlayers: Array<WsUser>;
	gameService: GameService;
}
