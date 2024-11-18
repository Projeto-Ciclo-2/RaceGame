import { carOptions, IPlayerControllable } from "../../interfaces/IRoom";
import { CarController } from "../controller/carController";

export function getPlayerControllable(
	id: string,
	username: string,
	ready: boolean,
	carID: carOptions
): IPlayerControllable {
	return {
		id: id,
		username: username,
		carID: carID,
		alive: true,
		lastMessageAt: undefined,

		carController: new CarController(),
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
