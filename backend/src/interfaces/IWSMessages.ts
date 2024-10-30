import { IMessage, IRoom } from "./IRoom";


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
}

export interface WsRoomInfo {
	type: "roomInfo";
	room: IRoom;
}

export interface WsJoinGame {
	type: "joinGame";
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
	started_at: string;
}

export interface WsBroadcastPlayerMove {
	type: "broadcastPlayerMove";
	roomID: string;
	userID: string;
	x: number;
	y: number;
}

export interface WsBroadcastPlayerPickItem {
	type: "broadcastPlayerPickItem";
	roomID: string;
	userID: string;
	itemID: string;
}

export interface WsPublishItem {
	type: "publishItem";
	roomID: string;
	itemID: string;
}

export interface WsEndGame {
	type: "endGame";
	roomID: string;
	winner: string; //username
}

/***********************************
 * |===============================|
 * | FRONT END WEB SOCKET MESSAGES |
 * |============================== |
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
	userID: string;
	x: number;
	y: number;
}

export interface WsPlayerPicksItem {
	type: "playerPicksItem";
	roomID: string;
	userID: string;
	itemID: number;
}

export interface WsPlayerArrives {
	type: "playerArrives";
	roomID: string;
	userID: string;
}
