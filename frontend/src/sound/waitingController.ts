import { mp3Src } from "../assets/enum/enumSrc";

export class WaitingSoundController {
	private itsWaitingTime = new Audio(mp3Src.itsWaitingTime);
	private playing = false;
	private active = true;

	constructor() {
		this.itsWaitingTime.volume = 0.5;
		this.itsWaitingTime.loop = true;
	}
	public changeActiveState(alive: boolean) {
		this.active = alive;
		if (alive) {
			this.playItsWaitingTime();
		} else {
			this.stopItsWaitingTime();
		}
	}
	public playItsWaitingTime() {
		if (!this.playing && this.active) {
			this.itsWaitingTime.play();
			this.playing = true;
		}
	}
	public stopItsWaitingTime() {
		if (this.playing) {
			this.itsWaitingTime.pause();
			this.playing = false;
		}
	}
}
