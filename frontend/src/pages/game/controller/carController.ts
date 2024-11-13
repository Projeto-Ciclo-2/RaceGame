import { SoundController } from "../../../sound/soundController";
import { IItems, IPlayer, rotation } from "../interfaces/gameInterfaces";

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

	private width = 30;
	private height = 30;

	private maxVelocity = 6.5;
	private acceleration = 0.13;
	private decelerationRate = 0.04;
	private maxDecelerationRate = 0.09;

	private maxItems = 3;

	private nitroAcceleration = 0.1;
	private nitroDuration = 2500;
	private nitroMaxVelocity = 8;

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

		this.defineRotation(futurePlayer);
		this.updateHitBox(futurePlayer);
		this.decreaseVelocityOverTime(futurePlayer, maxVelocity);

		this.getFuturePosition(futurePlayer);
		this.correctVelocities(futurePlayer, maxVelocity);

		// futurePlayer.x = Math.floor(futurePlayer.x);
		// futurePlayer.y = Math.floor(futurePlayer.y);
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
			this.increasePlayerVelocity(player, this.nitroMaxVelocity);
			this.applyNitro(player);
			return;
		}
		this.increasePlayerVelocity(player, this.maxVelocity);
	}

	private increasePlayerVelocity(player: IPlayer, maxVelocity: number) {
		const upSpeed = player.velocities.vy + this.acceleration * -1;
		const downSpeed = player.velocities.vy + this.acceleration;
		const leftSpeed = player.velocities.vx + this.acceleration * -1;
		const rightSpeed = player.velocities.vx + this.acceleration;

		const upCanIncrease = upSpeed > maxVelocity * -1;
		const downCanIncrease = downSpeed < maxVelocity;
		const leftCanIncrease = leftSpeed > maxVelocity * -1;
		const rightCanIncrease = rightSpeed < maxVelocity;

		const {
			ArrowUp: keyUp,
			ArrowDown: keyDown,
			ArrowLeft: keyLeft,
			ArrowRight: keyRight,
		} = this.keys;

		if (keyUp && upCanIncrease && !player.disableArrow.up) {
			player.velocities.vy = Number.parseFloat(upSpeed.toFixed(2));
			player.nitroDirection.up = true;
			player.nitroDirection.down = false;
			player.nitroDirection.right = false;
			player.nitroDirection.left = false;
		}
		if (keyDown && downCanIncrease && !player.disableArrow.down) {
			player.velocities.vy = Number.parseFloat(downSpeed.toFixed(2));
			player.nitroDirection.up = false;
			player.nitroDirection.down = true;
			player.nitroDirection.right = false;
			player.nitroDirection.left = false;
		}
		if (keyLeft && leftCanIncrease && !player.disableArrow.left) {
			player.velocities.vx = Number.parseFloat(leftSpeed.toFixed(2));
			player.nitroDirection.up = false;
			player.nitroDirection.down = false;
			player.nitroDirection.right = false;
			player.nitroDirection.left = true;
		}
		if (keyRight && rightCanIncrease && !player.disableArrow.right) {
			player.velocities.vx = Number.parseFloat(rightSpeed.toFixed(2));
			player.nitroDirection.up = false;
			player.nitroDirection.down = false;
			player.nitroDirection.right = true;
			player.nitroDirection.left = false;
		}

		player.x += player.velocities.vx;
		player.y += player.velocities.vy;
	}

	private applyNitro(player: IPlayer) {
		const { down, left, right, up } = player.nitroDirection;
		if (up) {
			player.velocities.vy -= this.nitroAcceleration;
		}
		if (down) {
			player.velocities.vy += this.nitroAcceleration;
		}
		if (left) {
			player.velocities.vx -= this.nitroAcceleration;
		}
		if (right) {
			player.velocities.vx += this.nitroAcceleration;
		}
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

	private defineRotation(player: IPlayer) {
		const {
			ArrowUp: up,
			ArrowDown: down,
			ArrowLeft: left,
			ArrowRight: right,
		} = this.keys;

		const rotationMap: { [key: string]: rotation } = {
			"up,left": 45,
			up: 90,
			"up,right": 135,
			right: 180,
			"down,right": 235,
			down: 270,
			"down,left": 315,
			left: 0,
		};

		const pressedKey = [
			up && "up",
			down && "down",
			left && "left",
			right && "right",
		]
			.filter(Boolean)
			.join(",");

		player.rotation = rotationMap[pressedKey] ?? player.rotation;
	}

	private updateHitBox(player: IPlayer) {
		const verticalRotations = [90, 270];
		// const leftDiagonalRotations = [45, 235];
		// const rightDiagonalRotations = [135, 315];

		if (verticalRotations.includes(player.rotation)) {
			player.height = this.width;
			player.width = this.height;
			return;
		}
		player.height = this.height;
		player.width = this.width;
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
