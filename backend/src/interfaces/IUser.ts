export interface IUser {
	id: string; //uuid;
	username: string;
	created_at: string; //timestamp

	wins: number;
	messages_send: number;
	picked_items: number;
	played_games: number;
}
