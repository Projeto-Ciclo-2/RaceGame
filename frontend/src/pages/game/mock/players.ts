import { IPlayer } from "../interfaces/gameInterfaces";
const spawn = {
	x: 380,
	y: 540,
};
export const players: Array<IPlayer> = [
	{
		id: "abcd1234",
		username: "carloash",
		color: "1",

		ready: true,
		canControl: true,
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
		nitroParticles: [],

		rotation: 0,
		x: spawn.x,
		y: spawn.y,
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
	},
	{
		id: "abcd1235",
		username: "eduarsodks",

		color: "2",
		ready: true,
		canControl: false,
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
		nitroParticles: [],

		rotation: 0,
		x: spawn.x + 5,
		y: spawn.y - 35,
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
	},
	{
		id: "abcd1235",
		username: "cadu",

		color: "3",
		ready: true,
		canControl: false,
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
		nitroParticles: [],
		x: spawn.x,
		y: spawn.y + 10,
		rotation: 0,

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
	},
];
