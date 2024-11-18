import { carOptions, IPlayer } from "../../interfaces/IRoom";

export function getPlayer(
	id: string,
	username: string,
	ready: boolean,
	carID: carOptions
): IPlayer {
	return {
		id: id,
		username: username,
		carID: carID,

		alive: true,
		lastMessageAt: undefined,

		ready: ready,
		checkpoint: 0,
		done_laps: 0,

		items: [],
		pickedItems: 0,

		usingNitro: false,
		nitroUsedAt: null,

		moveNumber: 0,

		rotation: 0,
		rotationAcceleration: 0,
		x: 380,
		y: 540,
		height: 25,
		width: 25,

		velocities: {
			vx: 0,
			vy: 0,
		},
		disableArrow: {
			up: false,
			down: false,
			left: false,
			right: false,
		},
	};
}
