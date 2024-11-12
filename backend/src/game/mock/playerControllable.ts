import { IPlayerControllable } from "../../interfaces/IRoom";
import { CarController } from "../controller/carController";

export function getPlayerControllable(
	id: string,
	username: string,
	ready: boolean
): IPlayerControllable {
	return {
		id: id,
		username: username,
		alive: true,
		lastMessageAt: undefined,

		carController: new CarController(),
		ready: ready,
		checkpoint: 0,
		done_laps: 0,

		items: [],
		usingNitro: false,
		nitroUsedAt: null,
		nitroDirection: {
			down: false,
			up: false,
			left: false,
			right: false,
		},

		moveNumber: 0,

		rotation: 0,
		x: 380,
		y: 540,
		height: 30,
		width: 30,
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
