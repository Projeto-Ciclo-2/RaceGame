import { carOptions } from "../../interfaces/IAssets";

export function getCarKey(carOption: carOptions): carsKeys {
	return {
		1: "carBlue",
		2: "carGreen",
		3: "carPurple",
		4: "carPink",
		5: "carCyan",
		6: "carBlackRed",
		7: "carOrangeMIN",
		8: "carWhiteMIN",
		9: "carOrangeAltMIN",
		10: "carJadeMIN",
		11: "carAmethystMIN",
	}[carOption] as carsKeys;
}
type carsKeys =
	| "carBlue"
	| "carGreen"
	| "carPurple"
	| "carPink"
	| "carCyan"
	| "carBlackRed"
	| "carOrangeMIN"
	| "carWhiteMIN"
	| "carOrangeAltMIN"
	| "carJadeMIN"
	| "carAmethystMIN";

export const src = {
	map1: "/assets/svg/map1.svg",
	// cars
	carBlue: "/assets/svg/carBlue.svg",
	carYellow: "/assets/svg/carYellow.svg",
	carGreen: "/assets/svg/carGreen.svg",
	// car variations
	carAmethyst: "/assets/svg/carAmethyst.svg",
	carAmethystMIN: "/assets/svg/carAmethystMIN.svg",
	carBlackRed: "/assets/svg/carBlackRed.svg",
	carCyan: "/assets/svg/carCyan.svg",
	carJade: "/assets/svg/carJade.svg",
	carJadeMIN: "/assets/svg/carJadeMIN.svg",
	carOrange: "/assets/svg/carOrange.svg",
	carOrangeMIN: "/assets/svg/carOrangeMIN.svg",
	carOrangeAlt: "/assets/svg/carOrange2.svg",
	carOrangeAltMIN: "/assets/svg/carOrange2MIN.svg",
	carPink: "/assets/svg/carPink.svg",
	carPurple: "/assets/svg/carPurple.svg",
	carWhite: "/assets/svg/carWhite.svg",
	carWhiteMIN: "/assets/svg/carWhiteMIN.svg",
	// cars usuals
	carUsualBlue: "/assets/svg/carUsualBlue.svg",
	carUsualRed: "/assets/svg/carUsualRed.svg",
	carUsualWhite: "/assets/svg/carUsualWhite.svg",
	carPolice: "/assets/svg/carPolice.svg",
	carTaxi: "/assets/svg/carTaxi.svg",
	// others
	nitro: "/assets/svg/nitro.svg",
	nitroMin: "/assets/svg/nitro_min.svg",
	barrel: "/assets/svg/barrel.svg",
	tree_log: "/assets/svg/tree_log.svg",
	wheel: "/assets/svg/wheel.svg",
	music: "/assets/svg/music.svg",
};

export const mp3Src = {
	acceleration: "/assets/sounds/acceleration.mp3",
	bump1: "/assets/sounds/bump1.mp3",
	bump2: "/assets/sounds/bump2.mp3",
	bump3: "/assets/sounds/bump3.mp3",
	countdown: "/assets/sounds/countdown.mp3",
	endNitro: "/assets/sounds/endNitro.mp3",
	itsRaceTime: "/assets/sounds/itsRaceTime.mp3",
	lapDone: "/assets/sounds/lapDone.mp3",
	nitro: "/assets/sounds/nitro.mp3",
	nitroCollected: "/assets/sounds/nitroCollected.mp3",
	start: "/assets/sounds/start.mp3",
	itsWaitingTime: "/assets/sounds/itsWaitingTime.mp3",
};
