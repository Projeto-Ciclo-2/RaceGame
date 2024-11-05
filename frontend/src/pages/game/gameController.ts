import { config } from "../../config/config";
import { MapController } from "./controller/mapController";
import { GameDebug } from "./debug/gameDebug";
import { IItems, IPlayer } from "./interfaces/gameInterfaces";

export class GameController {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	private mapController: MapController;

	private gameDebug: GameDebug;

	private bkg: CanvasImageSource;
	private userCar: CanvasImageSource;

	private debug = true || config.DEBUG_MODE;

	private spawn = {
		x: 380,
		y: 540,
	};

	private players: Array<IPlayer> = [
		{
			id: "abcd1234",
			username: "carlo",
			checkpoint: 0,
			done_laps: 0,
			items: [],
			usingNitro: false,
			nitroUsedAt: null,
			ready: true,
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
			disableArrow: {
				up: false,
				down: false,
				left: false,
				right: false,
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
			this.mapController = new MapController(this.canvas, this.players);
			return;
		}
		throw new Error("Canvas has no correct context.");
	}

	public start() {
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
		const entities = this.mapController.getEntities();
		this.renderPlayers(entities.players);
		this.renderItems(entities.items);

		if (this.debug) {
			// this.gameDebug.makeHitBox(this.hitBox);
			// this.gameDebug.makeGrid();
			for (const p of entities.players) {
				this.gameDebug.renderDebugInfo(p);
			}
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
}
