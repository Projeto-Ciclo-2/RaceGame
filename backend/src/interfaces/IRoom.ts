export interface IPosition {
	x: number;
	y: number;
}

export interface IPlayer {
	id: string;
	username: string;
	ready: boolean;
	position: IPosition;
}

export interface IMessage {
	content: string;
	creator: string;
	creatorID: string;
}

export interface IRoom {
	id: string;
	laps: number;
	map: 1;
	players: Array<IPlayer>
	messages: Array<IMessage>
}
