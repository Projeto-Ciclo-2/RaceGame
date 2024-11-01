import { config } from "../../config/config";
import { CarController } from "./controller/carController";
import { GameDebug } from "./debug/gameDebug";
import { IBox, IPlayer } from "./interfaces/gameInterfaces";

export class GameController {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	private gameDebug: GameDebug;
	private carController = new CarController();

	private bkg: CanvasImageSource;
	private userCar: CanvasImageSource;

	private debug = true || config.DEBUG_MODE;

	private hitBox: Array<IBox> = [
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
				up: 0,
				down: 0,
				left: 0,
				right: 0,
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
				this.gameDebug.renderDebugInfo(p);
			}
			this.gameDebug.renderCollidedBoxes(this.boxCollided);
			this.gameDebug.renderPlayerInfo(this.players);
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

				let result = this.validateMove(futurePlayer);
				let ttl = 30;
				while (typeof result !== "boolean" && ttl > 0) {
					this.breakVelocity(p, futurePlayer);
					this.correctMerge(futurePlayer, result);
					result = this.validateMove(futurePlayer);
					ttl--;
				}
				this.collisions = {
					up: false,
					down: false,
					left: false,
					right: false,
				};

				this.checkPlayerInsideMap(p);
				return futurePlayer;
			}
			return p;
		});
	}

	private validateMove(player: IPlayer): true | IBox {
		const futurePlayer = Object.assign({}, player);

		let boxMerge: undefined | IBox;

		if (this.debug) {
			this.gameDebug.renderPlayerHitBox(
				futurePlayer.x,
				futurePlayer.y,
				futurePlayer.width,
				futurePlayer.height
			);
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
				up: 0,
				down: 0,
				left: 0,
				right: 0,
			};
		}
		if (player.y < 0 || player.y + player.height > this.canvas.height) {
			player.x = this.spawn.x;
			player.y = this.spawn.y;
			player.velocities = {
				up: 0,
				down: 0,
				left: 0,
				right: 0,
			};
		}
	}

	private breakVelocity(oldPlayer: IPlayer, futurePlayer: IPlayer) {
		if (futurePlayer.x > oldPlayer.x) {
			const newVelocity = Math.floor(
				futurePlayer.velocities.right * -1 * 0.3
			);
			futurePlayer.velocities.left =
				newVelocity === -1 ? -0.5 : newVelocity;
			futurePlayer.velocities.right = 0;
			this.collisions.right = true;
		}
		if (futurePlayer.x < oldPlayer.x) {
			const newVelocity = Math.ceil(
				futurePlayer.velocities.left * -1 * 0.3
			);
			futurePlayer.velocities.right =
				newVelocity === 1 ? 0.5 : newVelocity;
			futurePlayer.velocities.left = 0;
			this.collisions.left = true;
		}
		if (futurePlayer.y > oldPlayer.y) {
			const newVelocity = Math.floor(
				futurePlayer.velocities.down * -1 * 0.3
			);
			futurePlayer.velocities.up =
				newVelocity === -1 ? -0.5 : newVelocity;
			futurePlayer.velocities.down = 0;
			this.collisions.down = true;
		}
		if (futurePlayer.y < oldPlayer.y) {
			const newVelocity = Math.ceil(
				futurePlayer.velocities.up * -1 * 0.3
			);
			futurePlayer.velocities.down =
				newVelocity === 1 ? 0.5 : newVelocity;
			futurePlayer.velocities.up = 0;
			this.collisions.up = true;
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
