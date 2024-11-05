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

	private maxItems = 3;

	private maxVelocity = 5.5;
	private acceleration = 0.06;
	private decelerationRate = 0.01;
	private maxDecelerationRate = 0.05;

	private nitroDuration = 2000;
	private nitroMaxVelocity = 7;

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

		this.defineRotation(futurePlayer);
		this.updateHitBox(futurePlayer);
		this.decreaseVelocityOverTime(futurePlayer);

		this.getFuturePosition(futurePlayer);
		this.correctVelocities(futurePlayer);

		return futurePlayer;
	}

	public useItem(player: IPlayer, item: IItems) {
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
				player.velocities.vx += item.velocity_effect;
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
				player.velocities.vy += item.velocity_effect;
			}
		}
	}

	public addNitro(player: IPlayer, item: IItems): boolean {
		if (player.items.length >= this.maxItems) {
			return false;
		}
		player.items.push(item);
		return true;
	}

	private getFuturePosition(player: IPlayer): IPlayer {
		const upVelocity = player.velocities.vy + this.acceleration * -1;
		const downVelocity = player.velocities.vy + this.acceleration;
		const leftVelocity = player.velocities.vx + this.acceleration * -1;
		const rightVelocity = player.velocities.vx + this.acceleration;

		const upCanIncrease = upVelocity > this.maxVelocity * -1;
		const downCanIncrease = downVelocity < this.maxVelocity;
		const leftCanIncrease = leftVelocity > this.maxVelocity * -1;
		const rightCanIncrease = rightVelocity < this.maxVelocity;

		const keyUp = this.keys.ArrowUp;
		const keyDown = this.keys.ArrowDown;
		const keyLeft = this.keys.ArrowLeft;
		const keyRight = this.keys.ArrowRight;

		if (keyUp && upCanIncrease && !player.disableArrow.up) {
			player.velocities.vy = upVelocity;
		}
		if (keyDown && downCanIncrease && !player.disableArrow.down) {
			player.velocities.vy = downVelocity;
		}
		if (keyLeft && leftCanIncrease && !player.disableArrow.left) {
			player.velocities.vx = leftVelocity;
		}
		if (keyRight && rightCanIncrease && !player.disableArrow.right) {
			player.velocities.vx = rightVelocity;
		}

		player.x += player.velocities.vx;
		player.y += player.velocities.vy;

		return player;
	}

	private checkNitroValidity(player: IPlayer) {
		if(player.usingNitro && player.nitroUsedAt) {
			const limitDate = player.nitroUsedAt + this.nitroDuration;
			const now = Date.now();

			if(now >= limitDate) {
				player.usingNitro = false;
				player.nitroUsedAt = null;
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

	private correctVelocities(player: IPlayer) {
		const { vx, vy } = player.velocities;
		const negativeMaxVelocity = this.maxVelocity * -1;

		if (vx > this.maxVelocity || vx < negativeMaxVelocity) {
			player.velocities.vx = 0;
		}
		if (vy > this.maxVelocity || vy < negativeMaxVelocity) {
			player.velocities.vy = 0;
		}
	}

	private decreaseVelocityOverTime(player: IPlayer) {
		const { vx, vy } = player.velocities;
		const negativeMaxVelocity = this.maxVelocity * -1;

		this.defineDecelerationRate();

		if (vy < 0 && vy > negativeMaxVelocity) {
			const newSpeed = player.velocities.vy + this.decelerationRate;
			const speed = newSpeed > 0 ? 0 : newSpeed;
			player.velocities.vy = speed;
		} else if (vy > 0 && vy < this.maxVelocity) {
			const newSpeed = player.velocities.vy - this.decelerationRate;
			const speed = newSpeed < 0 ? 0 : newSpeed;
			player.velocities.vy = speed;
		}

		if (vx < 0 && vx > negativeMaxVelocity) {
			const newSpeed = player.velocities.vx + this.decelerationRate;
			const speed = newSpeed > 0 ? 0 : newSpeed;
			player.velocities.vx = speed;
		} else if (vx > 0 && vx < this.maxVelocity) {
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
				} else {
					this.keys[key] = alive;
				}
			}
		};
		handle(e.key);
		handle(e.code);
	}
}
