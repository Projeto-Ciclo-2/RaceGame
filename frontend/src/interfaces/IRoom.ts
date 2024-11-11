type checkPointOrder = 1 | 2 | 3 | 4 | 5;

export interface IBox {
	x: number;
	y: number;
	width: number;
	height: number;
}
export interface IPlayer extends IBox {
	id: string;
	username: string;
	alive: boolean;
	lastMessageAt: undefined | number; //timestamp

	ready: boolean;

	done_laps: number;
	checkpoint: checkPointOrder | 0;

	items: Array<IItems>;
	usingNitro: boolean;
	nitroUsedAt: number | null; //timestamp
	nitroDirection: {
		up: boolean;
		down: boolean;
		left: boolean;
		right: boolean;
	};

	moveNumber: number;

	x: number;
	y: number;

	width: number;
	height: number;

	rotation: number;

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

export interface IEntities {
	players: Array<IPlayer>;
	items: Array<IItems>;
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
