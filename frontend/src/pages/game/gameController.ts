import { config } from "../../config/config";
import { MapController } from "./controller/mapController";
import { GameDebug } from "./debug/gameDebug";
import { IItems, IParticle, IPlayer } from "./interfaces/gameInterfaces";

import bkg from "./assets/map1.svg";
import car from "./assets/blue-car.svg";
import { loadImage } from "./tools/imgLoader";
import { players } from "./mock/players";

export class GameController {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	private mapController: MapController;

	private gameDebug: GameDebug;

	private bkg: CanvasImageSource | undefined;
	private userCar: CanvasImageSource | undefined;

	private particleColors = ["red", "orange", "white", "crimson"];
	private particlesLimit = 50;

	private debug = true || config.DEBUG_MODE;

	private players: Array<IPlayer> = players;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		const ctx = this.canvas.getContext("2d");
		if (ctx) {
			this.ctx = ctx;
			this.gameDebug = new GameDebug(this.ctx);
			this.mapController = new MapController(this.canvas, this.players);

			Promise.all([loadImage(bkg), loadImage(car)])
				.then(([bkgImg, carImg]) => {
					this.bkg = bkgImg;
					this.userCar = carImg;
				})
				.catch((error) => {
					console.error("Failed to load images:", error);
				});
			return;
		}
		throw new Error("Canvas has no correct context.");
	}

	public start() {
		this.animate();
	}

	private animate() {
		if (!this.bkg || !this.userCar) {
			window.requestAnimationFrame(() => this.animate());
			return;
		}
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.drawImage(
			this.bkg,
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);
		const entities = this.mapController.getEntities();
		this.renderPlayers(entities.players);
		this.renderItems(entities.items);

		if (this.debug) {
			// this.gameDebug.makeHitBox(this.mapController.getWalls());
			// this.gameDebug.makeGrid();
			entities.players.forEach((p, i) => {
				this.gameDebug.renderDebugInfo(p, 10 + (i * 200));
			})
			this.gameDebug.renderCollidedBoxes(
				this.mapController.getWallsCollided()
			);
			// this.gameDebug.renderPlayerInfo(this.players);
			this.gameDebug.renderBoxes(
				this.mapController.getCheckPoints(),
				"#44FFadbb"
			);
			this.gameDebug.renderBoxes(
				[this.mapController.getFinishLine()],
				"#bbbb0099"
			);
			// this.gameDebug.renderKeyInfo(this.mapController._getCarKeys());
		}

		window.requestAnimationFrame(() => this.animate());
	}

	private renderPlayers(players: Array<IPlayer>) {
		this.ctx.fillStyle = "red";
		for (const p of players) {
			this.drawNitroParticles(p);
			this.drawnUsername(p);

			this.ctx.save();
			this.ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
			this.ctx.rotate((p.rotation * Math.PI) / 180);

			this.ctx.drawImage(
				this.userCar!,
				-p.defaultWidth / 2,
				-p.defaultHeight / 2,
				p.defaultWidth,
				p.defaultHeight
			);

			this.ctx.restore();
		}
	}

	private renderItems(items: Array<IItems>) {
		for (const item of items) {
			this.ctx.fillStyle = "#ff4455AA";
			if (item.type === 1) {
				this.ctx.fillStyle = "#0044ff99";
			}
			if (item.type === 3) {
				this.ctx.fillStyle = "#AA44FF99";
			}
			this.ctx.fillRect(item.x, item.y, item.width, item.height);
		}
	}

	private drawNitroParticles(player: IPlayer) {
		if (player.usingNitro) {
			player.nitroParticles.push(this.getParticle(player));
			player.nitroParticles.push(this.getParticle(player));
		}
		player.nitroParticles = player.nitroParticles
			.map((particle) => {
				particle.x -= particle.velocityX;
				particle.y += particle.velocityY;
				particle.opacity -= 0.01;

				this.ctx.fillStyle = particle.color;
				this.ctx.globalAlpha = particle.opacity;
				this.ctx.fillRect(
					particle.x,
					particle.y,
					particle.width,
					particle.height
				);

				return particle;
			})
			.filter((particle) => particle.opacity > 0);
		this.ctx.globalAlpha = 1;
	}

	private getParticle(player: IPlayer): IParticle {
		return {
			x: player.x + Math.floor(Math.random() * 10),
			y: player.y + Math.floor(Math.random() * 10),
			width: Math.floor(Math.random() * 2 + 1),
			height: Math.floor(Math.random() * 3 + 1),
			velocityX: Math.floor((Math.random() - 0.5) * 0.5),
			velocityY: Math.floor(Math.random() * 1 + 1),
			color: this.particleColors[
				Math.floor(Math.random() * this.particleColors.length)
			],
			opacity: 1,
		};
	}

	private drawnUsername(player: IPlayer) {
		this.ctx.font = "Press Start 2P 16px bold";
		this.ctx.fillStyle = "white";
		this.ctx.strokeStyle = "black";
		this.ctx.lineWidth = 2;

		const x =
			player.x +
			player.width / 2 -
			player.username.slice(0, 20).length * 3.5;
		const y = player.y + player.height + 15;
		this.ctx.strokeText(player.username.slice(0, 15), x, y);
		this.ctx.fillText(player.username.slice(0, 15), x, y);
	}
}
