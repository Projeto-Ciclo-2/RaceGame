export interface IItems {
	id: string;
	velocity_effect: number;
}

export interface IPlayer {
	id: string;
	username: string;

	ready: boolean;

	x: number;
	y: number;

	width: number;
	height: number;

	done_laps: number;
	done_checkpoints: number;

	velocities: {
		vx: number;
		vy: number;
	}

	items: Array<IItems>
}

export interface IMessage {
	content: string;
	username: string;
	userID: string;
}

export interface IRoom {
	id: string;
	laps: number;
	map: 1;
	players: Array<IPlayer>
	messages: Array<IMessage>
}
