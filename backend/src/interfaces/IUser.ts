import { WebSocket } from "ws";

export interface IUser {
	id: string; //uuid;
	username: string;
	name: string;
	created_at: string; //timestamp
	google_id: string;
	wins: number;
	messages_send: number;
	picked_items: number;
	played_games: number;
}

export interface IGoogleProfile {
	sub: string;
	email: string;
	verified_email: boolean;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	locale: string;
	gender?: string;
	birthday?: string;
	link?: string;
}

export interface WsUser {
	username: string;
	ws: WebSocket;
}
