import { IPlayer, rotation, typeOptions } from "../interfaces/gameInterfaces";

export class CarController {
	private options = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
	private keys = {
		ArrowLeft: false,
		ArrowRight: false,
		ArrowUp: false,
		ArrowDown: false,
	};

	private width = 30;
	private height = 30;

	private maxVelocity = 5.5;
	private acceleration = 0.06;
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
		const upVelocity = player.velocities.vy + this.acceleration * -1;
		const downVelocity = player.velocities.vy + this.acceleration;
		const leftVelocity = player.velocities.vx + this.acceleration * -1;
		const rightVelocity = player.velocities.vx + this.acceleration;

		const upCanIncrease = upVelocity > this.maxVelocity * -1;
		const downCanIncrease = downVelocity < this.maxVelocity;
		const leftCanIncrease = leftVelocity > this.maxVelocity * -1;
		const rightCanIncrease = rightVelocity < this.maxVelocity;

		if (this.keys.ArrowUp && upCanIncrease) {
			player.velocities.vy = upVelocity;
		}
		if (this.keys.ArrowDown && downCanIncrease) {
			player.velocities.vy = downVelocity;
		}
		if (this.keys.ArrowLeft && leftCanIncrease) {
			player.velocities.vx = leftVelocity;
		}
		if (this.keys.ArrowRight && rightCanIncrease) {
			player.velocities.vx = rightVelocity;
		}

		player.x += player.velocities.vx;
		player.y += player.velocities.vy;

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
		if (this.options.includes(e.key)) {
			const key = e.key as any as typeOptions;
			this.keys[key] = alive;
		}
	}
}
