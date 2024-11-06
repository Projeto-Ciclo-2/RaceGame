import { IPlayerControllable } from "../../interfaces/IRoom";
import { CarController } from "../controller/carController";

export function getPlayerControllable(
	id: string,
	username: string
): IPlayerControllable {
	return {
		id: id,
		username: username,

		carController: new CarController(),
		ready: true,
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

		rotation: 0,
		x: 380,
		y: 540,
		height: 25,
		width: 35,
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
