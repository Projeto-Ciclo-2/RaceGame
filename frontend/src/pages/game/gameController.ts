import { config } from "../../config/config";

type typeOptions = "ArrowRight" | "ArrowLeft" | "ArrowUp" | "ArrowDown";
type rotation = 0 | 45 | 90 | 135 | 180 | 235 | 270 | 315;
interface IPlayer {
	canControl: boolean;
	rotation: rotation;
	x: number;
	y: number;
}

export class GameController {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	private bkg: CanvasImageSource;
	private userCar: CanvasImageSource;

	private debug = true || config.DEBUG_MODE;
	private gridPad = 20;

	private hitBox = [
		{ x: 0, y: 0, width: 60, height: 600 },
		{ x: 60, y: 0, width: 20, height: 40 },
		{ x: 80, y: 0, width: 760, height: 20 },
		{ x: 180, y: 20, width: 140, height: 20 },
		{ x: 200, y: 40, width: 100, height: 20 },
		{ x: 200, y: 60, width: 80, height: 80 },
		{ x: 200, y: 140, width: 100, height: 120 },
		{ x: 300, y: 160, width: 20, height: 100 },
		{ x: 320, y: 180, width: 220, height: 80 },
		{ x: 500, y: 260, width: 40, height: 20 },
		{ x: 520, y: 280, width: 20, height: 140 },
		{ x: 680, y: 20, width: 80, height: 20 },
		{ x: 700, y: 40, width: 60, height: 560 },
		{ x: 680, y: 560, width: 20, height: 20 },
		{ x: 60, y: 560, width: 20, height: 20 },
		{ x: 60, y: 580, width: 640, height: 20 },
		{ x: 120, y: 80, width: 20, height: 440 },
		{ x: 140, y: 280, width: 20, height: 240 },
		{ x: 160, y: 300, width: 20, height: 220 },
		{ x: 180, y: 320, width: 280, height: 200 },
		{ x: 460, y: 440, width: 20, height: 80 },
		{ x: 480, y: 460, width: 20, height: 60 },
		{ x: 500, y: 480, width: 80, height: 40 },
		{ x: 580, y: 460, width: 20, height: 60 },
		{ x: 600, y: 90, width: 50, height: 430 },
		{ x: 350, y: 90, width: 250, height: 20 },
		{ x: 580, y: 110, width: 20, height: 20 },
	];
	private collisions = {
		up: false,
		down: false,
		left: false,
		right: false,
	};

	private width = 35;
	private height = 25;

	private maxVelocity = 5.5;
	private acceleration = 0.03;
	private decelerationRate = 0.01;
	private maxDecelerationRate = 0.05;
	private velocities = {
		up: 0,
		down: 0,
		left: 0,
		right: 0,
	};

	private options = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
	private keys = {
		ArrowLeft: false,
		ArrowRight: false,
		ArrowUp: false,
		ArrowDown: false,
	};

	private players: Array<IPlayer> = [
		{ canControl: true, rotation: 0, x: 380, y: 540 },
	];

	constructor(
		canvas: HTMLCanvasElement,
		bkg: CanvasImageSource,
		carImg: CanvasImageSource
	) {
		this.canvas = canvas;
		this.bkg = bkg;
		this.userCar = carImg;
		const ctx = this.canvas.getContext("2d");
		if (ctx) {
			this.ctx = ctx;
			return;
		}
		throw new Error("Canvas has no correct context.");
	}

	public listen() {
		document.addEventListener("keydown", (e) =>
			this.handleKeyPress(e, true)
		);
		document.addEventListener("keyup", (e) =>
			this.handleKeyPress(e, false)
		);
	}

	public start() {
		// window.requestAnimationFrame(() => this.animate);
		this.animate();
	}

	private animate() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.drawImage(
			this.bkg,
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);
		if (this.debug) {
			this.makeHitBox();
			// this.makeGrid();
			this.renderDebugInfo();
		}
		this.updatePlayers();
		this.renderPlayers();
		window.requestAnimationFrame(() => this.animate());
	}

	private renderPlayers() {
		this.ctx.fillStyle = "red";
		for (const p of this.players) {
			this.ctx.save();
			this.ctx.translate(p.x + this.width / 2, p.y + this.height / 2);
			this.ctx.rotate((p.rotation * Math.PI) / 180);

			this.ctx.drawImage(
				this.userCar,
				-this.width / 2,
				-this.height / 2,
				this.width,
				this.height
			);

			this.ctx.restore();
		}
	}

	private updatePlayers() {
		this.players = this.players.map((p) => {
			if (p.canControl) {
				this.defineRotation(p);
				this.decreaseVelocityOverTime();

				let valid = this.validateMove(p);
				let ttl = 30;
				while (!valid && ttl > 0) {
					this.reduceVelocity(p);
					valid = this.validateMove(p);
					ttl--;
				}

				return this.updatePosition(p);
			}
			return p;
		});
	}

	private updatePosition(player: IPlayer): IPlayer {
		const tempPlayer = Object.assign({}, player);

		this.correctVelocities();

		const upVelocity = this.velocities.up + this.acceleration * -1;
		const downVelocity = this.velocities.down + this.acceleration;
		const leftVelocity = this.velocities.left + this.acceleration * -1;
		const rightVelocity = this.velocities.right + this.acceleration;

		const upCanIncrease =
			upVelocity <= 0 && upVelocity > this.maxVelocity * -1;
		const downCanIncrease =
			downVelocity >= 0 && downVelocity < this.maxVelocity;
		const leftCanIncrease =
			leftVelocity <= 0 && leftVelocity > this.maxVelocity * -1;
		const rightCanIncrease =
			rightVelocity >= 0 && rightVelocity < this.maxVelocity;

		if (this.keys.ArrowUp && upCanIncrease) {
			this.velocities.up = upVelocity;
			if (this.velocities.down > 0) {
				this.velocities.down -= this.acceleration;
			}
		}
		if (this.keys.ArrowDown && downCanIncrease) {
			this.velocities.down = downVelocity;
			if (this.velocities.up < 0) {
				this.velocities.up += this.acceleration;
			}
		}
		if (this.keys.ArrowLeft && leftCanIncrease) {
			this.velocities.left = leftVelocity;
			if (this.velocities.right > 0) {
				this.velocities.right -= this.acceleration;
			}
		}
		if (this.keys.ArrowRight && rightCanIncrease) {
			this.velocities.right = rightVelocity;
			if (this.velocities.left < 0) {
				this.velocities.left += this.acceleration;
			}
		}

		const horizontalMove = this.velocities.left + this.velocities.right;
		const verticalMove = this.velocities.up + this.velocities.down;
		tempPlayer.x += horizontalMove;
		tempPlayer.y += verticalMove;

		return tempPlayer;
	}

	private validateMove(player: IPlayer): boolean {
		const futurePlayer = this.updatePosition(player);
		const sizes = { width: this.width, height: this.height };

		let boxMerge;

		const verticalRotations = [90, 270];
		// const leftDiagonalRotations = [45, 235];
		// const rightDiagonalRotations = [135, 315];

		if (verticalRotations.includes(futurePlayer.rotation)) {
			sizes.width = this.height;
			sizes.height = this.width;
		}
		const valid = this.hitBox.every((box) => {
			const playerRightBiggerThanBox =
				futurePlayer.x + sizes.width > box.x;
			const playerLeftShorterThanBox = futurePlayer.x < box.x + box.width;
			const horizontalMerge =
				playerRightBiggerThanBox && playerLeftShorterThanBox;

			const playerBottomBiggerThanBox =
				futurePlayer.y + sizes.height > box.y;
			const playerTopShortenThanBox = futurePlayer.y < box.y + box.height;
			const verticalMerge =
				playerBottomBiggerThanBox && playerTopShortenThanBox;

			if (horizontalMerge && verticalMerge) {
				boxMerge = box;
			}

			return !horizontalMerge || !verticalMerge;
		});
		if (boxMerge) console.log(boxMerge);
		return valid;
	}

	private reduceVelocity(currentPlayer: IPlayer): IPlayer {
		const futurePos = this.updatePosition(currentPlayer);

		if (futurePos.x > currentPlayer.x) {
			this.velocities.left = Math.floor((this.velocities.right * -1) / 2);
			this.velocities.right = 0;
		}
		if (futurePos.x < currentPlayer.x) {
			this.velocities.right = Math.ceil((this.velocities.left * -1) / 2);
			this.velocities.left = 0;
		}
		if (futurePos.y > currentPlayer.y) {
			this.velocities.up = Math.floor((this.velocities.down * -1) / 2);
			this.velocities.down = 0;
		}
		if (futurePos.y < currentPlayer.y) {
			this.velocities.down = Math.ceil((this.velocities.up * -1) / 2);
			this.velocities.up = 0;
		}
		return this.updatePosition(currentPlayer);
	}

	private decreaseVelocityOverTime() {
		const { up, down, left, right } = this.velocities;
		const negativeMaxVelocity = this.maxVelocity * -1;

		this.defineDecelerationRate();

		if (up < 0 && up > negativeMaxVelocity) {
			this.velocities.up += this.decelerationRate;
		}
		if (down > 0 && down < this.maxVelocity) {
			this.velocities.down -= this.decelerationRate;
		}
		if (left < 0 && left > negativeMaxVelocity) {
			this.velocities.left += this.decelerationRate;
		}
		if (right > 0 && right < this.maxVelocity) {
			this.velocities.right -= this.decelerationRate;
		}
	}

	private correctVelocities() {
		const up = this.velocities.up;
		const down = this.velocities.down;
		const left = this.velocities.left;
		const right = this.velocities.right;
		const negativeMaxVelocity = this.maxVelocity * -1;

		if (up > 0 || up < negativeMaxVelocity) {
			this.velocities.up = 0;
		}
		if (down < 0 || down > this.maxVelocity) {
			this.velocities.down = 0;
		}
		if (left > 0 || left < negativeMaxVelocity) {
			this.velocities.left = 0;
		}
		if (right < 0 || right > this.maxVelocity) {
			this.velocities.right = 0;
		}
	}

	private defineRotation(player: IPlayer) {
		const up = this.keys.ArrowUp;
		const down = this.keys.ArrowDown;
		const left = this.keys.ArrowLeft;
		const right = this.keys.ArrowRight;

		if (!up && !down && !right && left) {
			player.rotation = 0;
		}

		if (up && left && !right && !down) {
			player.rotation = 45;
		}

		if (up && !left && !right && !down) {
			player.rotation = 90;
		}

		if (up && right && !left && !down) {
			player.rotation = 135;
		}

		if (!up && !down && !left && right) {
			player.rotation = 180;
		}

		if (right && down && !left && !up) {
			player.rotation = 235;
		}

		if (down && !right && !left && !up) {
			player.rotation = 270;
		}

		if (left && down && !right && !up) {
			player.rotation = 315;
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

	private makeHitBox() {
		this.ctx.fillStyle = "#cd853f99";
		for (const x of this.hitBox) {
			this.ctx.fillRect(x.x, x.y, x.width, x.height);
		}
	}

	private makeGrid() {
		this.ctx.fillStyle = "black";
		for (let index = 0; index <= this.canvas.width; index += this.gridPad) {
			if (index === this.canvas.width) index--;
			this.ctx.fillRect(index, 0, 1, this.canvas.height);
		}
		for (
			let index = 0;
			index <= this.canvas.height;
			index += this.gridPad
		) {
			if (index === this.canvas.height) index--;
			this.ctx.fillRect(0, index, this.canvas.width, 1);
		}
	}

	private renderDebugInfo() {
		this.ctx.font = "16px Arial";
		this.ctx.fillStyle = "white";
		this.ctx.strokeStyle = "black";
		this.ctx.lineWidth = 2;

		const debugText = [
			`Velocities:`,
			`Up: ${this.velocities.up}`,
			`Down: ${this.velocities.down}`,
			`Left: ${this.velocities.left}`,
			`Right: ${this.velocities.right}`,
		];

		debugText.forEach((text, index) => {
			const yPosition = 20 + index * 20;
			this.ctx.strokeText(text, 10, yPosition);
			this.ctx.fillText(text, 10, yPosition);
		});
	}

	private handleKeyPress(e: KeyboardEvent, alive: boolean) {
		if (this.options.includes(e.key)) {
			const key = e.key as any as typeOptions;
			this.keys[key] = alive;
		}
	}
}
