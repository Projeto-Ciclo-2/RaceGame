import { config } from "../../config/config";
import { CarController } from "./controller/carController";
import { GameDebug } from "./debug/gameDebug";
import { IBox, IPlayer } from "./interfaces/gameInterfaces";
import { CollisionDetector } from "./tools/collisionDetect";

export class GameController {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	private gameDebug: GameDebug;
	private carController = new CarController();
	private collisionDetector = new CollisionDetector();

	private bkg: CanvasImageSource;
	private userCar: CanvasImageSource;

	private debug = true || config.DEBUG_MODE;

	private hitBox: Array<IBox> = [
		{ x: 0, y: 0, width: 55, height: 600 },
		{ x: 55, y: 0, width: 25, height: 25 },
		{ x: 80, y: 0, width: 760, height: 15 },
		{ x: 195, y: 15, width: 115, height: 15 },
		{ x: 210, y: 30, width: 80, height: 20 },
		{ x: 210, y: 50, width: 70, height: 90 },
		{ x: 210, y: 140, width: 80, height: 110 },
		{ x: 290, y: 170, width: 30, height: 80 },
		{ x: 320, y: 180, width: 220, height: 70 },
		{ x: 490, y: 250, width: 50, height: 10 },
		{ x: 515, y: 260, width: 25, height: 20 },
		{ x: 525, y: 280, width: 15, height: 135 },
		{ x: 700, y: 15, width: 60, height: 15 },
		{ x: 720, y: 30, width: 50, height: 570 },
		{ x: 710, y: 560, width: 10, height: 10 },
		{ x: 690, y: 570, width: 30, height: 10 },
		{ x: 55, y: 570, width: 25, height: 10 },
		{ x: 55, y: 580, width: 665, height: 20 },
		{ x: 125, y: 85, width: 15, height: 425 },
		{ x: 140, y: 290, width: 10, height: 220 },
		{ x: 150, y: 320, width: 30, height:190 },
		{ x: 180, y: 325, width: 275, height: 185 },
		{ x: 455, y: 470, width: 15, height: 10 },
		{ x: 455, y: 480, width: 25, height: 30 },
		{ x: 480, y: 480, width: 20, height: 30 },
		{ x: 500, y: 490, width: 80, height: 20 },
		{ x: 580, y: 480, width: 30, height: 30 },
		{ x: 610, y: 90, width: 40, height: 420 },
		{ x: 350, y: 90, width: 260, height: 15 },
		{ x: 590, y: 105, width: 20, height: 10 },
	];
	private boxCollided: Array<IBox> = [];
	private collisions = {
		up: false,
		down: false,
		left: false,
		right: false,
	};

	private spawn = {
		x: 380,
		y: 540,
	};

	private players: Array<IPlayer> = [
		{
			canControl: true,
			rotation: 0,
			x: this.spawn.x,
			y: this.spawn.y,
			height: 25,
			width: 35,
			defaultHeight: 25,
			defaultWidth: 35,
			velocities: {
				vx: 0,
				vy: 0,
			},
		},
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
			this.gameDebug = new GameDebug(this.ctx);
			return;
		}
		throw new Error("Canvas has no correct context.");
	}

	public listen() {
		this.carController.listen();
	}

	public start() {
		// this.hitBox = [];
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
			// this.gameDebug.makeHitBox(this.hitBox);
			// this.gameDebug.makeGrid();
			for (const p of this.players) {
				// this.gameDebug.renderDebugInfo(p);
			}
			// this.gameDebug.renderCollidedBoxes(this.boxCollided);
			// this.gameDebug.renderPlayerInfo(this.players);
		}
		this.updatePlayers();
		this.renderPlayers();
		window.requestAnimationFrame(() => this.animate());
	}

	private renderPlayers() {
		this.ctx.fillStyle = "red";
		for (const p of this.players) {
			this.ctx.save();
			this.ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
			this.ctx.rotate((p.rotation * Math.PI) / 180);

			this.ctx.drawImage(
				this.userCar,
				-p.defaultWidth / 2,
				-p.defaultHeight / 2,
				p.defaultWidth,
				p.defaultHeight
			);

			this.ctx.restore();
		}
	}

	private updatePlayers() {
		this.players = this.players.map((p) => {
			if (p.canControl) {
				const futurePlayer = this.carController.getFutureCarPosition(p);

				const result = this.validateMove(futurePlayer);
				if (typeof result !== "boolean") {
					this.collisionDetector.resolveCollision(
						p,
						futurePlayer,
						result
					);
					// this.detectMerge(futurePlayer, result);
					// this.breakVelocity(p, futurePlayer);
					// this.correctMerge(futurePlayer, result);
				}

				// this.checkPlayerInsideMap(futurePlayer);
				return futurePlayer;
			}
			return p;
		});
	}

	private validateMove(player: IPlayer): true | IBox {
		const futurePlayer = Object.assign({}, player);

		let boxMerge: undefined | IBox;

		if (this.debug) {
			// this.gameDebug.renderPlayerHitBox(
			// 	futurePlayer.x,
			// 	futurePlayer.y,
			// 	futurePlayer.width,
			// 	futurePlayer.height
			// );
		}

		const valid = this.hitBox.every((box) => {
			const playerRightBiggerThanBox =
				futurePlayer.x + futurePlayer.width > box.x;
			const playerLeftShorterThanBox = futurePlayer.x < box.x + box.width;
			const horizontalMerge =
				playerRightBiggerThanBox && playerLeftShorterThanBox;

			const playerBottomBiggerThanBox =
				futurePlayer.y + futurePlayer.height > box.y;
			const playerTopShortenThanBox = futurePlayer.y < box.y + box.height;
			const verticalMerge =
				playerBottomBiggerThanBox && playerTopShortenThanBox;

			if (horizontalMerge && verticalMerge) {
				boxMerge = box;
			}

			return !horizontalMerge || !verticalMerge;
		});
		if (!valid && boxMerge) {
			this.boxCollided.push(boxMerge);
			if (this.boxCollided.length >= 3) {
				this.boxCollided.shift();
			}
			return boxMerge;
		}
		return valid as true;
	}

	private checkPlayerInsideMap(player: IPlayer): void {
		if (player.x < 0 || player.x + player.width > this.canvas.width) {
			player.x = this.spawn.x;
			player.y = this.spawn.y;
			player.velocities = {
				vx: 0,
				vy: 0,
			};
		}
		if (player.y < 0 || player.y + player.height > this.canvas.height) {
			player.x = this.spawn.x;
			player.y = this.spawn.y;
			player.velocities = {
				vx: 0,
				vy: 0,
			};
		}
	}

	private detectMerge(p: IPlayer, box: IBox) {
		this.collisions.up = false;
		this.collisions.down = false;
		this.collisions.left = false;
		this.collisions.right = false;

		const leftSidePlayer = p.x;
		const rightSidePlayer = p.x + p.width;
		const topSidePlayer = p.y;
		const bottomSidePlayer = p.y + p.height;

		const leftSideBox = box.x;
		const rightSideBox = box.x + box.width;
		const topSideBox = box.y;
		const bottomSideBox = box.y + box.height;

		if (bottomSidePlayer > topSideBox && topSidePlayer < bottomSideBox) {
			if (
				leftSidePlayer < rightSideBox &&
				rightSidePlayer > leftSideBox
			) {
				if (p.x < leftSideBox) this.collisions.right = true;
				if (rightSidePlayer > rightSideBox) this.collisions.left = true;
			}
		}

		if (leftSidePlayer < rightSideBox && rightSidePlayer > leftSideBox) {
			if (
				topSidePlayer < bottomSideBox &&
				bottomSidePlayer > topSideBox
			) {
				if (topSidePlayer < topSideBox) this.collisions.down = true;
				if (bottomSidePlayer > bottomSideBox) this.collisions.up = true;
			}
		}
	}

	private breakVelocity(oldPlayer: IPlayer, futurePlayer: IPlayer) {
		if (futurePlayer.x > oldPlayer.x) {
			const newSpeed = Math.floor(futurePlayer.velocities.vx * -1 * 0.3);
			futurePlayer.velocities.vx = newSpeed === -1 ? -0.5 : newSpeed;
		}
		if (futurePlayer.x < oldPlayer.x) {
			const newSpeed = Math.ceil(futurePlayer.velocities.vx * -1 * 0.3);
			futurePlayer.velocities.vx = newSpeed === 1 ? 0.5 : newSpeed;
		}
		if (futurePlayer.y > oldPlayer.y) {
			const newSpeed = Math.floor(futurePlayer.velocities.vy * -1 * 0.3);
			futurePlayer.velocities.vy = newSpeed === -1 ? -0.5 : newSpeed;
		}
		if (futurePlayer.y < oldPlayer.y) {
			const newSpeed = Math.ceil(futurePlayer.velocities.vy * -1 * 0.3);
			futurePlayer.velocities.vy = newSpeed === 1 ? 0.5 : newSpeed;
		}
	}

	private correctMerge(player: IPlayer, mergedBox: IBox) {
		if (this.collisions.up) {
			const diference = mergedBox.y + mergedBox.height - player.y;
			player.y += diference;
		}
		if (this.collisions.down) {
			const diference = player.y + player.height - mergedBox.y;
			player.y -= diference;
		}
		if (this.collisions.left) {
			const diference = mergedBox.x + mergedBox.width - player.x;
			player.x += diference;
		}
		if (this.collisions.right) {
			const diference = player.x + player.width - mergedBox.x;
			player.x -= diference;
		}
	}
}
