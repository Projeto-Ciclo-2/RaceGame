import { mp3Src } from "../assets/enum/enumSrc";

export class SoundController {
	private sfxActive = true;
	private music = true;
	private acceleration = new Audio(mp3Src.acceleration);
	private bump1 = new Audio(mp3Src.bump1);
	private bump2 = new Audio(mp3Src.bump2);
	private bump3 = new Audio(mp3Src.bump3);
	private countdown = new Audio(mp3Src.countdown);
	private endNitro = new Audio(mp3Src.endNitro);
	private itsRaceTime = new Audio(mp3Src.itsRaceTime);
	private lapDone = new Audio(mp3Src.lapDone);
	private nitro = new Audio(mp3Src.nitro);
	private nitroCollected = new Audio(mp3Src.nitroCollected);
	private start = new Audio(mp3Src.start);

	constructor() {
		this["nitro"].volume = 0.5;
		this["endNitro"].volume = 0.5;
		this["itsRaceTime"].volume = 0.1;
		this.itsRaceTime.loop = true;
		this.lapDone.volume = 1;
		console.log("soundController created");
	}

	public changeActiveState(isPlaying: boolean) {
		this.sfxActive = isPlaying;
		if (isPlaying) {
			this.playItsRaceTime();
		} else {
			this.stopAcceleration();
			this.stopItsRaceTime();
			this.stopNitro();
		}
	}

	public playAcceleration() {
		if (this.sfxActive && this.acceleration.ended) {
			this.acceleration.play();
		}
	}

	public stopAcceleration() {
		this.acceleration.pause();
	}

	public playSomeBump() {
		if (this.sfxActive) {
			const r = Math.round(Math.random() * 2);
			if (r === 0) {
				this.bump1.play();
			} else if (r === 1) {
				this.bump2.play();
			} else {
				this.bump3.play();
			}
		}
	}

	public playCountdown() {
		if (this.sfxActive) {
			this.countdown.play();
		}
	}

	public playEndNitro() {
		if (this.sfxActive) {
			// this.endNitro.play();
		}
	}

	public playItsRaceTime() {
		if (this.sfxActive && this.itsRaceTime.paused) {
			this.itsRaceTime.play();
		}
	}
	public stopItsRaceTime() {
		this.itsRaceTime.pause();
	}

	public playLapDone() {
		if (this.sfxActive) {
			this.lapDone.play();
		}
	}

	public playNitro() {
		if (this.sfxActive) {
			this.nitro.play();
		}
	}
	public stopNitro() {
		new Promise<NodeJS.Timer | undefined>((res, rej) => {
			const i = setInterval(() => {
				const volume = this.nitro.volume - 0.1;
				if (volume > 0) {
					this.nitro.volume = volume;
				} else {
					res(i);
				}
			}, 250);
		}).then((i: NodeJS.Timer | undefined) => {
			clearInterval(i);
			this.nitro.volume = 0.5;
			this.nitro.pause();
		});
	}

	public playNitroCollected() {
		if (this.sfxActive) {
			this.nitroCollected.play();
		}
	}

	public playStart() {
		if (this.sfxActive) {
			this.start.play();
		}
	}
}
