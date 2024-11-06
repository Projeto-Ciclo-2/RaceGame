import { config } from "../../config/config";
import { MapController } from "./controller/mapController";
import { GameDebug } from "./debug/gameDebug";
import { IItems, IParticle, IPlayer } from "./interfaces/gameInterfaces";

import bkg from "./assets/map1.svg";
import carBlue from "./assets/carBlue.svg";
import carYellow from "./assets/carYellow.svg";
import carGreen from "./assets/carGreen.svg";
import { loadImage } from "./tools/imgLoader";
import { WebSocketContextType } from "../../context/WebSocketContext";
import { WebSocketHandler } from "./websocket/websocketHandler";

export class GameController {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	private mapController: MapController | undefined;
	private websocketContext: WebSocketContextType;
	private websocketHandler = new WebSocketHandler();

	private roomID: string | undefined = "1234";

	private gameDebug: GameDebug;

	private bkg: CanvasImageSource | undefined;
	private carBlue: CanvasImageSource | undefined;
	private carYellow: CanvasImageSource | undefined;
	private carGreen: CanvasImageSource | undefined;

	private particleColors = ["red", "orange", "white", "crimson"];
	private particlesLimit = 50;

	private debug = true || config.DEBUG_MODE;

	private username: string;
	private players: Array<IPlayer> = [];

	constructor(
		canvas: HTMLCanvasElement,
		websocketContext: WebSocketContextType,
		username: string
	) {
		this.canvas = canvas;
		const ctx = this.canvas.getContext("2d");
		if (ctx) {
			this.username = username;
			this.ctx = ctx;
			this.gameDebug = new GameDebug(this.ctx);

			this.websocketContext = websocketContext;

			Promise.all([
				loadImage(bkg),
				loadImage(carBlue),
				loadImage(carYellow),
				loadImage(carGreen),
			])
				.then(([bkgImg, carBlue, carYellow, carGreen]) => {
					this.bkg = bkgImg;
					this.carBlue = carBlue;
					this.carYellow = carYellow;
					this.carGreen = carGreen;
				})
				.catch((error) => {
					console.error("Failed to load images:", error);
				});
			return;
		}
		throw new Error("Canvas has no correct context.");
	}

	public start() {
		this.listenWebSocket();
		this.animate();
	}

	private listenWebSocket() {
		this.websocketContext.onReceiveGameState((e) => {
			this.websocketHandler.handleGameState(
				e,
				this.players,
				this.username
			);
		});
	}

	private animate() {
		if (
			!this.bkg ||
			!this.carGreen ||
			!this.carBlue ||
			!this.carYellow ||
			!this.mapController
		) {
			this.initMapController();
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
		const playablePlayers = this.players.filter(
			(p) => p.canControl === true
		);
		const entities = this.mapController.getEntities(playablePlayers);
		for (const p of entities.players) {
			this.players = this.players.map((player) => {
				if (player.id === p.id) {
					return p;
				}
				return player;
			});
		}
		this.renderPlayers(this.players);
		this.renderItems(entities.items);

		if (this.debug) {
			// this.gameDebug.makeHitBox(this.mapController.getWalls());
			// this.gameDebug.makeGrid();
			// .forEach((p, i) => {
			// });
			// this.gameDebug.renderDebugInfo(entities.players[0], 10);
			// this.gameDebug.renderCollidedBoxes(
			// 	this.mapController.getWallsCollided()
			// );
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
			this.ctx.save();

			this.drawNitroParticles(p);

			if (!p.canControl) {
				this.ctx.globalAlpha = 0.5;
			}

			this.drawnUsername(p);

			this.ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
			this.ctx.rotate((p.rotation * Math.PI) / 180);

			const img =
				p.color === "1"
					? this.carBlue!
					: p.color === "2"
					? this.carGreen!
					: this.carYellow!;

			this.ctx.drawImage(
				img,
				-p.width / 2,
				-p.height / 2,
				p.width,
				p.height
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

	private initMapController() {
		if (!this.mapController && this.players.length > 0 && this.roomID) {
			const player = this.players.find((p) => p.canControl);
			if (player) {
				this.mapController = new MapController(
					this.canvas,
					this.websocketContext,
					player,
					this.roomID
				);
			}
		}
	}
}
