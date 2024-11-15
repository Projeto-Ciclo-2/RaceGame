import { SoundController } from "../../../sound/soundController";
import { IItems, IPlayer } from "../interfaces/gameInterfaces";
// import { degreesToRadians } from "../math/angleConversion";
// import { minAngleDiff } from "../math/angleDiff";
// import { naturalToGameAngle } from "../math/naturalToGameAngle";

type keyValid = "ArrowRight" | "ArrowLeft" | "ArrowUp" | "ArrowDown" | "Space";
type keyAccept = keyValid | "w" | "s" | "d" | "a";
export class CarController {
	private options: Array<keyAccept> = [
		"ArrowRight",
		"ArrowLeft",
		"ArrowUp",
		"ArrowDown",
		"Space",
		"w",
		"s",
		"d",
		"a",
	];
	private keys = {
		ArrowLeft: false,
		ArrowRight: false,
		ArrowUp: false,
		ArrowDown: false,
		Space: false,
	};

	private width = 25;
	private height = 25;

	private maxVelocity = 6;
	private acceleration = 0.2;
	private decelerationRate = 0.04;
	private maxDecelerationRate = 0.09;

	private maxItems = 3;

	private nitroAcceleration = 0.1;
	private nitroDuration = 2500;
	private nitroMaxVelocity = 8;

	private rotationSpeed = .5;
	private maxRotationSpeed = 6;

	private soundController: SoundController;

	constructor(soundController: SoundController) {
		this.soundController = soundController;
	}

	public _getKeys() {
		return this.keys;
	}

	public listen() {
		document.addEventListener("keydown", (e) =>
			this.handleKeyPress(e, true)
		);
		document.addEventListener("keyup", (e) =>
			this.handleKeyPress(e, false)
		);
	}

	public getFutureCarPosition(player: IPlayer): IPlayer {
		const futurePlayer = Object.assign({}, player);

		this.checkNitroValidity(futurePlayer);
		this.triggerNitroIfSpacePressed(futurePlayer);

		const maxVelocity = futurePlayer.usingNitro
			? this.nitroMaxVelocity
			: this.maxVelocity;

		this.decreaseVelocityOverTime(futurePlayer, maxVelocity);

		this.getFuturePosition(futurePlayer);
		this.correctVelocities(futurePlayer, maxVelocity);

		this.correctRotation(futurePlayer);

		const {vx, vy} = futurePlayer.velocities;
		futurePlayer.velocities.vx = Number.parseFloat(vx.toFixed(2));
		futurePlayer.velocities.vy = Number.parseFloat(vy.toFixed(2));
		futurePlayer.x = Number.parseFloat(futurePlayer.x.toFixed(2));
		futurePlayer.y = Number.parseFloat(futurePlayer.y.toFixed(2));

		return futurePlayer;
	}

	public useItem(player: IPlayer, item: IItems) {
		this.soundController.playSomeBump();
		if (player.velocities.vx > 0) {
			const diference = player.velocities.vx + item.velocity_effect;
			if (diference < 0) {
				player.velocities.vx = 0;
			} else {
				player.velocities.vx += item.velocity_effect;
			}
		}
		if (player.velocities.vx < 0) {
			const diference = player.velocities.vx + item.velocity_effect * -1;

			if (diference > 0) {
				player.velocities.vx = 0;
			} else {
				player.velocities.vx += item.velocity_effect * -1;
			}
		}
		if (player.velocities.vy > 0) {
			const diference = player.velocities.vy + item.velocity_effect;
			if (diference < 0) {
				player.velocities.vy = 0;
			} else {
				player.velocities.vy += item.velocity_effect;
			}
		}
		if (player.velocities.vy < 0) {
			const diference = player.velocities.vy + item.velocity_effect * -1;
			if (diference > 0) {
				player.velocities.vy = 0;
			} else {
				player.velocities.vy += item.velocity_effect * -1;
			}
		}
	}

	public addNitro(player: IPlayer, item: IItems): boolean {
		if (player.items.length >= this.maxItems) {
			return false;
		}
		player.items.push(item);
		this.soundController.playNitroCollected();
		return true;
	}

	private getFuturePosition(player: IPlayer) {
		const nitro = player.usingNitro;
		if (nitro) {
			this.increasePlayerVelocity(player, true);
			return;
		}
		this.increasePlayerVelocity(player, false);
	}

	private increasePlayerVelocity(player: IPlayer, usingNitro: boolean) {
		const {
			ArrowUp: keyUp,
			ArrowDown: keyDown,
			ArrowLeft: keyLeft,
			ArrowRight: keyRight,
		} = this.keys;

		const {vx, vy} = player.velocities;
		const tempAcceleration = Math.ceil(Math.abs(vx) + Math.abs(vy));

		if (keyLeft) {
			player.rotationAcceleration -= this.rotationSpeed * tempAcceleration;
			if (player.rotationAcceleration < -this.maxRotationSpeed) {
				player.rotationAcceleration = -this.maxRotationSpeed;
			}
			//
		} else if (keyRight) {
			player.rotationAcceleration += this.rotationSpeed * tempAcceleration;
			if (player.rotationAcceleration > this.maxRotationSpeed) {
				player.rotationAcceleration = this.maxRotationSpeed;
			}
		}

		if (player.rotationAcceleration > 0) {
			player.rotationAcceleration -= 0.5;
			if (player.rotationAcceleration < 0) {
				player.rotationAcceleration = 0;
			}
		}
		if (player.rotationAcceleration < 0) {
			player.rotationAcceleration += 0.5;
			if (player.rotationAcceleration > 0) {
				player.rotationAcceleration = 0;
			}
		}

		player.rotation += player.rotationAcceleration;

		let acceleration = this.acceleration;
		if (usingNitro) {
			acceleration += this.nitroAcceleration;
		}

		if (keyUp) {
			player.velocities.vy +=
				-acceleration * Math.sin((player.rotation * Math.PI) / 180);
			player.velocities.vx +=
				-acceleration * Math.cos((player.rotation * Math.PI) / 180);
		}
		if (keyDown) {
			player.velocities.vy +=
				acceleration * Math.sin((player.rotation * Math.PI) / 180);
			player.velocities.vx +=
				acceleration * Math.cos((player.rotation * Math.PI) / 180);
		}

		player.x += player.velocities.vx;
		player.y += player.velocities.vy;
	}

	private checkNitroValidity(player: IPlayer) {
		if (player.usingNitro && player.nitroUsedAt) {
			const limitDate = player.nitroUsedAt + this.nitroDuration;
			const now = Date.now();

			if (now >= limitDate) {
				player.usingNitro = false;
				player.nitroUsedAt = null;
				this.soundController.stopNitro();
				this.soundController.playEndNitro();
			}
		}
	}

	private triggerNitroIfSpacePressed(player: IPlayer) {
		if (this.keys.Space) {
			this.useNitro(player);
		}
	}

	private useNitro(player: IPlayer) {
		if (player.items.length > 0 && !player.usingNitro) {
			player.usingNitro = true;
			player.nitroUsedAt = Date.now();
			player.items.shift();
			this.soundController.playNitro();
		}
	}

	private correctVelocities(player: IPlayer, maxVelocity: number) {
		const { vx, vy } = player.velocities;
		const negativeMaxVelocity = maxVelocity * -1;

		if (vx > maxVelocity) {
			const diference = vx - maxVelocity;
			player.velocities.vx -= diference;
		}
		if (vx < negativeMaxVelocity) {
			const diference = Math.abs(vx) - maxVelocity;
			player.velocities.vx += diference;
		}
		if (vy > maxVelocity) {
			const diference = vy - maxVelocity;
			player.velocities.vy -= diference;
		}
		if (vy < negativeMaxVelocity) {
			const diference = Math.abs(vy) - maxVelocity;
			player.velocities.vy += diference;
		}
	}

	private correctRotation(player: IPlayer) {
		if (player.rotation >= 360) {
			player.rotation = 0;
		}
		if (player.rotation < 0) {
			player.rotation = 360;
		}
	}

	private decreaseVelocityOverTime(player: IPlayer, maxVelocity: number) {
		const { vx, vy } = player.velocities;
		const negativeMaxVelocity = maxVelocity * -1;

		this.defineDecelerationRate();

		if (vy < 0 && vy > negativeMaxVelocity) {
			const newSpeed = player.velocities.vy + this.decelerationRate;
			const speed = newSpeed > 0 ? 0 : newSpeed;
			player.velocities.vy = speed;
			//
		} else if (vy > 0 && vy < maxVelocity) {
			const newSpeed = player.velocities.vy - this.decelerationRate;
			const speed = newSpeed < 0 ? 0 : newSpeed;
			player.velocities.vy = speed;
		}

		if (vx < 0 && vx > negativeMaxVelocity) {
			const newSpeed = player.velocities.vx + this.decelerationRate;
			const speed = newSpeed > 0 ? 0 : newSpeed;
			player.velocities.vx = speed;
			//
		} else if (vx > 0 && vx < maxVelocity) {
			const newSpeed = player.velocities.vx - this.decelerationRate;
			const speed = newSpeed < 0 ? 0 : newSpeed;
			player.velocities.vx = speed;
		}
	}

	private defineDecelerationRate() {
		if (
			!this.keys.ArrowDown &&
			!this.keys.ArrowUp &&
			!this.keys.ArrowLeft &&
			!this.keys.ArrowRight
		) {
			if (this.decelerationRate < this.maxDecelerationRate) {
				this.decelerationRate += this.decelerationRate;
			}
		} else {
			this.decelerationRate = 0.01;
		}
	}

	private handleKeyPress(e: KeyboardEvent, alive: boolean) {
		const handle = (thisKey: any) => {
			if (this.options.includes(thisKey)) {
				const key = thisKey as any as keyAccept;
				const otherKeys = {
					w: "ArrowUp",
					s: "ArrowDown",
					a: "ArrowLeft",
					d: "ArrowRight",
				};

				if (key === "w" || key === "s" || key === "a" || key === "d") {
					const newKey = otherKeys[key] as keyValid;
					this.keys[newKey] = alive;
					// }
				} else {
					this.keys[key] = alive;
				}
			}
		};
		handle(e.key);
		handle(e.code);
	}
}
