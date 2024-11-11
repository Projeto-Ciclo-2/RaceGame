import { IEntities, IMessage, IPlayer, IRoom } from "./IRoom";

/**
 * |===============================|
 * | BACK END WEB SOCKET MESSAGES  |
 * |===============================|
 */
export interface WsAllRooms {
	type: "allRooms";
	rooms: Array<IRoom>;
}

export interface WsNewRoom {
	type: "newRoom";
	room: IRoom;
	creatorUserID: string;
}

export interface WsRoomInfo {
	type: "roomInfo";
	room: IRoom;
}

export interface WsBroadcastJoinGame {
	type: "broadcastJoinGame";
	username: string;
	userID: string;
	room: IRoom;
}

export interface WsBroadcastPlayerLeft {
	type: "broadcastPlayerLeft";
	username: string;
	userID: string;
	roomID: string;
}

export interface WsBroadcastNewMessage {
	type: "broadcastNewMessage";
	message: IMessage;
	roomID: string;
}

export interface WsBroadcastPlayerReady {
	type: "broadcastPlayerReady";
	userID: string;
	roomID: string;
}

export interface WsGameInit {
	type: "gameInit";
	roomID: string;
	started_at: number;
}

export interface WsBroadcastPlayerMove {
	type: "broadcastPlayerMove";
	roomID: string;
	player: IPlayer;
}

export interface WsBroadcastPlayerPickItem {
	type: "broadcastPlayerPickItem";
	roomID: string;
	userID: string;
	itemID: string;
}

export interface WsBroadcastUseItem {
	type: "broadcastUseItem";
	roomID: string;
	userID: string;
	itemID: string;
}

export interface WsPublishItem {
	type: "publishItem";
	roomID: string;
	itemID: string;
	x: number;
	y: number;
}

export interface WsEndGame {
	type: "endGame";
	roomID: string;
	players: Array<IPlayer>;
	winner: string; //username
}

export interface WsGameState {
	type: "gameState";
	entities: IEntities;
}

/***********************************
 * |===============================|
 * | FRONT END WEB SOCKET MESSAGES |
 * |===============================|
 ***********************************/

export interface WsCreateRoom {
	type: "createRoom";
	userID: string;
}

export interface WsRequestJoinRoom {
	type: "requestJoinRoom";
	roomID: string;
	userID: string;
}

export interface WsPlayerLeft {
	type: "playerLeft";
	roomID: string;
	userID: string;
	username: string;
}

export interface WsPostMessage {
	type: "postMessage";
	message: IMessage;
	roomID: string;
}

export interface WsPlayerReady {
	type: "playerReady";
	roomID: string;
	userID: string;
}

export interface WsPlayerMove {
	type: "playerMove";
	roomID: string;
	player: IPlayer;
	keys: {
		ArrowLeft: boolean;
		ArrowRight: boolean;
		ArrowUp: boolean;
		ArrowDown: boolean;
		Space: boolean;
	};
}

export interface WsPlayerPicksItem {
	type: "playerPicksItem";
	roomID: string;
	userID: string;
	itemID: number;
}

export interface WsPlayerUsesItem {
	type: "playerUsesItem";
	roomID: string;
	userID: string;
	itemID: string;
}

export interface WsPlayerArrives {
	type: "playerArrives";
	roomID: string;
	userID: string;
}

export interface WsRequestGameState {
	type: "requestGameState";
	roomID: string;
}
