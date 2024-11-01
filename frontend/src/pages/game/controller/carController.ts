import { IPlayer, rotation, typeOptions } from "../interfaces/gameInterfaces";

export class CarController {
	private options = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
	private keys = {
		ArrowLeft: false,
		ArrowRight: false,
		ArrowUp: false,
		ArrowDown: false,
	};

	private width = 35;
	private height = 25;

	private maxVelocity = 5.5;
	private acceleration = 0.04;
	private decelerationRate = 0.01;
	private maxDecelerationRate = 0.05;

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

		this.defineRotation(futurePlayer);
		this.updateHitBox(futurePlayer);
		this.decreaseVelocityOverTime(futurePlayer);

		this.getFuturePosition(futurePlayer);
		this.correctVelocities(futurePlayer);

		return futurePlayer;
	}

	private getFuturePosition(player: IPlayer): IPlayer {
		const upVelocity = player.velocities.up + this.acceleration * -1;
		const downVelocity = player.velocities.down + this.acceleration;
		const leftVelocity = player.velocities.left + this.acceleration * -1;
		const rightVelocity = player.velocities.right + this.acceleration;

		const upCanIncrease =
			upVelocity <= 0 && upVelocity > this.maxVelocity * -1;
		const downCanIncrease =
			downVelocity >= 0 && downVelocity < this.maxVelocity;
		const leftCanIncrease =
			leftVelocity <= 0 && leftVelocity > this.maxVelocity * -1;
		const rightCanIncrease =
			rightVelocity >= 0 && rightVelocity < this.maxVelocity;

		if (this.keys.ArrowUp && upCanIncrease) {
			player.velocities.up = upVelocity;
			if (player.velocities.down > 0) {
				player.velocities.down -= this.acceleration;
			}
		}
		if (this.keys.ArrowDown && downCanIncrease) {
			player.velocities.down = downVelocity;
			if (player.velocities.up < 0) {
				player.velocities.up += this.acceleration;
			}
		}
		if (this.keys.ArrowLeft && leftCanIncrease) {
			player.velocities.left = leftVelocity;
			if (player.velocities.right > 0) {
				player.velocities.right -= this.acceleration;
			}
		}
		if (this.keys.ArrowRight && rightCanIncrease) {
			player.velocities.right = rightVelocity;
			if (player.velocities.left < 0) {
				player.velocities.left += this.acceleration;
			}
		}

		const horizontalMove = player.velocities.left + player.velocities.right;
		const verticalMove = player.velocities.up + player.velocities.down;
		player.x += horizontalMove;
		player.y += verticalMove;

		return player;
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
		const { up, down, left, right } = player.velocities;
		const negativeMaxVelocity = this.maxVelocity * -1;

		if (up > 0 || up < negativeMaxVelocity) {
			player.velocities.up = 0;
		}
		if (down < 0 || down > this.maxVelocity) {
			player.velocities.down = 0;
		}
		if (left > 0 || left < negativeMaxVelocity) {
			player.velocities.left = 0;
		}
		if (right < 0 || right > this.maxVelocity) {
			player.velocities.right = 0;
		}
	}

	private decreaseVelocityOverTime(player: IPlayer) {
		const { up, down, left, right } = player.velocities;
		const negativeMaxVelocity = this.maxVelocity * -1;

		this.defineDecelerationRate();

		if (up < 0 && up > negativeMaxVelocity) {
			player.velocities.up += this.decelerationRate;
		}
		if (down > 0 && down < this.maxVelocity) {
			player.velocities.down -= this.decelerationRate;
		}
		if (left < 0 && left > negativeMaxVelocity) {
			player.velocities.left += this.decelerationRate;
		}
		if (right > 0 && right < this.maxVelocity) {
			player.velocities.right -= this.decelerationRate;
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
		if (this.options.includes(e.key)) {
			const key = e.key as any as typeOptions;
			this.keys[key] = alive;
		}
	}
}
