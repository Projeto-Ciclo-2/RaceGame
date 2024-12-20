import { config } from "../../config/config";
import { MapController } from "./controller/mapController";
import { GameDebug } from "./debug/gameDebug";
import {
	IItems,
	IOtherPlayer,
	IParticle,
	IPlayer as FrontPlayer,
	IDeletedItem,
} from "./interfaces/gameInterfaces";

import { loadImage } from "./tools/imgLoader";
import { WebSocketContextType } from "../../context/WebSocketContext";
import { WebSocketHandler } from "./websocket/websocketHandler";
import { WsPlayerMove } from "../../interfaces/IWSMessages";
import { src } from "../../assets/enum/enumSrc";
import { playerConverter } from "./tools/playerConverter";
import { EndScreen } from "./tools/endScreen";
import { IPlayer, IPlayerMIN } from "../../interfaces/IRoom";
import { SoundController } from "../../sound/soundController";
import { degreesToRadians } from "./math/angleConversion";
import { getRandomInt } from "./math/randomNumber";
import { ImgHandler } from "./tools/imgHandler";

export class GameController {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	private firstRender = true;
	private gameAlive = true;
	private gameStarted = false;

	private countDownMode = false;
	private countDown = 3;

	private mapController: MapController | undefined;
	private websocketContext: WebSocketContextType;
	private websocketHandler = new WebSocketHandler();
	private gameEndScreen: EndScreen;
	private soundController: SoundController;
	private carsImgHandler = new ImgHandler();

	private roomID: string | undefined;

	private gameDebug: GameDebug;

	private bkg: CanvasImageSource | undefined;
	private nitro: CanvasImageSource | undefined;
	private tree_log: CanvasImageSource | undefined;
	private barrel: CanvasImageSource | undefined;
	private wheel: HTMLImageElement | undefined;

	private particleColors = ["red", "orange", "white", "crimson"];
	private particlesLimit = 50;
	private nitroParticlesLimit = 100;

	private debug = config.DEBUG_MODE;

	private username: string;
	private userID: string;
	private myUser: FrontPlayer | undefined;
	private myUserChanged = false;

	private players: Array<FrontPlayer | IOtherPlayer> = [];
	private items: Array<IItems> = [];
	private deletedItems: Array<IDeletedItem> = [];
	private alreadyReceivePlayers = false;
	private winner: string | undefined;

	private setPlayersStatus: React.Dispatch<
		React.SetStateAction<(IPlayer | IPlayerMIN)[]>
	>;
	private setGameStatus: React.Dispatch<React.SetStateAction<boolean>>;
	private reactMe: React.MutableRefObject<IPlayer | undefined>;
	private reactWinner: React.MutableRefObject<string>;

	private lastKeys = {
		ArrowLeft: false,
		ArrowRight: false,
		ArrowUp: false,
		ArrowDown: false,
		Space: false,
	};

	private lastTime = 0;
	private fps = 30;
	private frameDuration = 1000 / this.fps;

	private fpsCounter = 0;
	private timestampFPS = 0;

	constructor(
		canvas: HTMLCanvasElement,
		websocketContext: WebSocketContextType,
		soundController: SoundController,
		username: string,
		userID: string,
		roomID: string,
		setPlayersStatus: React.Dispatch<
			React.SetStateAction<(IPlayer | IPlayerMIN)[]>
		>,
		setGameStatus: React.Dispatch<React.SetStateAction<boolean>>,
		me: React.MutableRefObject<IPlayer | undefined>,
		winner: React.MutableRefObject<string>
	) {
		this.canvas = canvas;
		const ctx = this.canvas.getContext("2d");
		if (ctx) {
			this.ctx = ctx;
			this.gameDebug = new GameDebug(this.ctx);
			this.gameEndScreen = new EndScreen(canvas);
			this.soundController = soundController;

			this.setPlayersStatus = setPlayersStatus;
			this.setGameStatus = setGameStatus;
			this.reactMe = me;
			this.reactWinner = winner;

			this.roomID = roomID;
			this.username = username;
			this.userID = userID;

			this.websocketContext = websocketContext;

			Promise.all([
				loadImage(src.map1),
				loadImage(src.nitroMin),
				loadImage(src.tree_log),
				loadImage(src.barrel),
				loadImage(src.wheel),
			])
				.then(([bkgImg, nitro, tree_log, barrel, wheel]) => {
					this.bkg = bkgImg;
					this.nitro = nitro;
					this.tree_log = tree_log;
					this.barrel = barrel;
					this.wheel = wheel;
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
		window.requestAnimationFrame((time) => this.animate(time));
	}

	private listenWebSocket() {
		this.websocketContext.onReceiveGameStart((e) => {
			const interval = setInterval(() => {
				this.countDown--;
				if (this.countDown <= 0) {
					clearInterval(interval);
					this.countDownMode = false;
					this.gameStarted = true;
					this.soundController.playStart();
				}
			}, 1000);
			this.countDownMode = true;
			this.soundController.playCountdown();
		});
		this.websocketContext.onReceiveGameState((e) => {
			const { items, deletedItems } =
				this.websocketHandler.handleGameState(
					e,
					this.players,
					this.items,
					this.deletedItems,
					this.username
				);
			this.items = items;
			this.deletedItems = deletedItems;

			this.setPlayersStatus(e.entities.players);
			this.alreadyReceivePlayers = true;
			if (e.started) {
				this.countDownMode = false;
				this.gameStarted = true;
			}
		});
		this.websocketContext.onReceiveEndGame((e) => {
			if (e.roomID === this.roomID) {
				this.gameAlive = false;
				this.players = e.players.map((p) => {
					const previousPlayer = this.players.find(
						(oldP) => oldP.username === p.username
					);
					return playerConverter(p, previousPlayer, this.username);
				});
				this.winner = e.winner;

				this.setPlayersStatus(e.players);
				this.setGameStatus(this.gameAlive);

				const foundUser = this.players.find(
					(u) => u.canControl
				) as FrontPlayer;
				this.reactMe.current = { ...foundUser, id: "" };

				this.reactWinner.current = e.winner;

				this.soundController.playStart();
				this.soundController.stopItsRaceTime();
				this.soundController.stopAcceleration();
				this.soundController.stopNitro();
			}
		});
	}

	private animate(timestamp: DOMHighResTimeStamp): void {
		if (
			!this.bkg ||
			!this.mapController ||
			!this.barrel ||
			!this.nitro ||
			!this.tree_log
		) {
			this.initMapController();
			window.requestAnimationFrame((time) => this.animate(time));
			return;
		}
		if (this.firstRender) {
			this.soundController.playItsRaceTime();
			this.websocketContext.sendClientReadyToPlay({
				roomID: this.roomID!,
				type: "clientReadyToPlay",
			});
			this.firstRender = false;
		}
		if (!this.gameAlive) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			if (!this.wheel) {
				// window.requestAnimationFrame((time) => this.animate(time));
				return;
			}
			if (!this.winner) {
				console.error("winner name not provided.");
				return;
			}
			// this.gameEndScreen.start(this.wheel, this.players, this.winner);
			return;
		}
		const durationOfLastExec = timestamp - this.lastTime;
		if (durationOfLastExec < this.frameDuration) {
			window.requestAnimationFrame((time) => this.animate(time));
			return;
		}

		this.renderDefaultBkg();

		if (this.gameStarted) {
			if (this.myUserChanged) {
				this.sendMove();
			}
			const entities = this.mapController.makePrediction(
				this.players,
				this.items,
				this.deletedItems
			);
			this.myUserChanged = entities.changed;
			this.players = entities.players;
			this.items = entities.items;
		}

		this.renderPlayers(this.players);
		this.renderItems(this.items);
		this.renderDeletedItems(this.deletedItems);

		if (!this.gameStarted) {
			this.renderCountDown();
		}

		if (this.debug) {
			// this.gameDebug.makeHitBox(this.mapController.getWalls());
			// this.gameDebug.makeGrid();
			// .forEach((p, i) => {
			// });
			// this.gameDebug.renderDebugInfo(entities.players[0], 10);
			// this.gameDebug.renderCollidedBoxes(
			// 	this.mapController.getWallsCollided()
			// );
			// this.myUser = this.players.find((u) => u.canControl) as FrontPlayer;
			// if (this.myUser) this.gameDebug.renderPlayerInfo([this.myUser]);
			// this.gameDebug.renderBoxes(
			// 	this.mapController.getCheckPoints(),
			// 	"#44FFadbb"
			// );
			// this.gameDebug.renderBoxes(
			// 	[this.mapController.getFinishLine()],
			// 	"#bbbb0099"
			// );
			// this.gameDebug.renderKeyInfo(this.mapController._getCarKeys());
		}

		this.updateFPSInfo(timestamp);
		window.requestAnimationFrame((time) => this.animate(time));
	}

	private sendMove() {
		if (
			!this.websocketContext.isConnected ||
			this.websocketContext.socket?.readyState !== WebSocket.OPEN
		) {
			return;
		}
		if (!this.myUser) {
			this.myUser = this.players.find((u) => u.canControl) as FrontPlayer;
		}
		if (this.myUser) {
			const newKeys = this.mapController!._getCarKeys();
			const message: WsPlayerMove = {
				type: "playerMove",
				roomID: this.roomID!,
				player: {
					id: this.userID,
				},
				keys: newKeys,
			};
			this.websocketContext.sendPlayerMove(message);
			this.lastKeys = newKeys;
		} else {
			console.error(
				"not able to find the player of this user, dumb code."
			);
		}
	}

	private renderDefaultBkg(): void {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.drawImage(
			this.bkg!,
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);
	}

	private renderPlayers(players: Array<FrontPlayer | IOtherPlayer>) {
		this.ctx.fillStyle = "red";
		for (const p of players) {
			this.drawNitro(p);
			this.drawNitroParticles(p);

			this.drawnUsername(p);

			if (p.canControl) {
				this.ctx.save();
				this.ctx.filter =
					"brightness(0) saturate(100%) invert(13%) sepia(100%) saturate(5435%) hue-rotate(2deg) brightness(105%) contrast(101%)"; // Red filter

				const newWidth = p.width + 3;
				const newHeight = p.height + 5;
				this.ctx.translate(
					p.x + newWidth / 2 - 1.5,
					p.y + newHeight / 2 - 2.5
				);
				this.ctx.rotate(degreesToRadians(p.rotation));
				this.ctx.drawImage(
					this.carsImgHandler.getImg(p.carID),
					-newWidth / 2,
					-newHeight / 2,
					newWidth,
					newHeight
				);

				this.ctx.restore();
			}
			this.ctx.save();
			if (!p.canControl) {
				this.ctx.globalAlpha = 0.5;
			}

			this.ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
			this.ctx.rotate((p.rotation * Math.PI) / 180);

			this.ctx.drawImage(
				this.carsImgHandler.getImg(p.carID),
				-p.width / 2,
				-p.height / 2,
				p.width,
				p.height
			);

			this.ctx.restore();
		}
	}

	private renderItems(items: Array<IItems>) {
		const imgs = {
			1: this.nitro!,
			2: this.barrel!,
			3: this.tree_log!,
		};
		for (const item of items) {
			const img = imgs[item.type];
			this.ctx.drawImage(img, item.x, item.y, item.width, item.height);
		}
	}

	private renderDeletedItems(deletedItems: Array<IDeletedItem>) {
		for (let index = 0; index < deletedItems.length; index++) {
			const item = deletedItems[index];

			if (item.particles.length <= 0) {
				for (let x = 0; x < item.width; x += 4) {
					const leftForce = x < item.width / 2;

					for (let y = 0; y < item.height; y += 4) {
						const topForce = y < item.height / 2;
						const n1 = Number.parseFloat(Math.random().toFixed(2));
						const n2 = Number.parseFloat(Math.random().toFixed(2));
						const velocityX = leftForce ? -n1 : n1;
						const velocityY = topForce ? -n2 : n2;
						const particle: IParticle = {
							color: "#964B00",
							height: 4,
							opacity: 1,
							velocityX: velocityX,
							velocityY: velocityY,
							width: 4,
							x: item.x + x,
							y: item.y + y,
						};
						item.particles.push(particle);
					}
				}
			}
			if (item.ttl > 0) {
				for (const particle of item.particles) {
					if (particle.opacity > 0) {
						this.ctx.save();
						// Draw the particle
						this.ctx.fillStyle = particle.color;
						this.ctx.globalAlpha = particle.opacity;
						this.ctx.fillRect(
							particle.x,
							particle.y,
							particle.width,
							particle.height
						);
						particle.x += particle.velocityX;
						particle.y += particle.velocityY;
						particle.opacity -= 0.1;
						this.ctx.restore();
					}
				}
				item.ttl--;
			}
		}
		this.deletedItems = deletedItems.filter((i) => i.ttl > 0);
	}

	private drawNitro(player: FrontPlayer | IOtherPlayer) {
		const angleRad = ((player.rotation + 180) % 360) * (Math.PI / 180);

		this.ctx.save();
		this.ctx.globalCompositeOperation = "lighter";

		if (
			player.usingNitro &&
			player.nitro.length < this.nitroParticlesLimit
		) {
			const particle = {
				x: player.x + player.width / 2,
				y: player.y + player.height / 2,
				radius: 6,
				hue: getRandomInt(0, 40),
			};
			player.nitro.push(particle);
		}

		for (const particle of player.nitro) {
			this.ctx.beginPath();
			this.ctx.arc(
				particle.x,
				particle.y,
				particle.radius,
				0,
				Math.PI * 2
			);
			this.ctx.fillStyle = `hsla(${particle.hue}, 100%, 55%, .5)`;
			this.ctx.fill();
			this.ctx.shadowColor = `hsla(${particle.hue}, 100%, 55%, 1)`;
			this.ctx.shadowBlur = 2.5;
			this.ctx.closePath();
		}

		player.nitro = player.nitro.map((particle) => {
			particle.radius -= 0.4;
			particle.y += -Math.sin(angleRad); // + getRandomInt(0, 2);
			particle.x += -Math.cos(angleRad); // + getRandomInt(0, 2);

			return particle;
		});
		player.nitro = player.nitro.filter((particle) => particle.radius > 0);

		this.ctx.restore();
	}

	private drawNitroParticles(player: FrontPlayer | IOtherPlayer) {
		this.ctx.save();
		this.ctx.globalCompositeOperation = "lighter";

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

		this.ctx.restore();
	}

	private getParticle(player: FrontPlayer | IOtherPlayer): IParticle {
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

	private drawnUsername(player: FrontPlayer | IOtherPlayer) {
		this.ctx.font = "bold 12px Arial";

		if (player.canControl) {
			this.ctx.fillStyle = "white";
			this.ctx.strokeStyle = "#FA0030";
		} else {
			this.ctx.fillStyle = "white";
			this.ctx.strokeStyle = "black";
		}
		this.ctx.lineWidth = 2;

		const x =
			player.x +
			player.width / 2 -
			player.username.slice(0, 20).length * 4;
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
					this.soundController
				);
				return;
			}
		}
		if (this.players.length <= 0 && !this.alreadyReceivePlayers) {
			if (this.websocketContext && this.roomID) {
				this.websocketContext.sendRequestGameState({
					roomID: this.roomID,
					type: "requestGameState",
				});
			} else {
				console.error(
					"not was possible to request game state. roomID missing."
				);
			}
		}
	}

	private renderCountDown() {
		this.ctx.fillStyle = "#00000050";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = "#ff5733";
		if (this.countDownMode) {
			this.ctx.font = "bold 100px Arial";
			this.ctx.fillText(
				this.countDown.toString(),
				this.canvas.width / 2,
				this.canvas.height / 2
			);
		} else {
			this.ctx.font = "bold 30px Arial";
			const text = "Waiting players...";
			this.ctx.fillText(
				text,
				this.canvas.width / 2 - text.length * 4,
				this.canvas.height / 2
			);
		}
	}

	private updateFPSInfo(timestamp: DOMHighResTimeStamp) {
		this.lastTime = timestamp;
		this.fpsCounter += 1;
		const timestampLimit = this.timestampFPS + 1000;
		const now = Date.now();
		if (timestampLimit < now) {
			this.fpsCounter = 0;
			this.timestampFPS = now;
		}
		if (this.debug) {
			this.renderFPS();
		}
	}

	private renderFPS() {
		this.ctx.fillStyle = "black";
		this.ctx.fillStyle = "white";
		this.ctx.strokeStyle = "black";
		this.ctx.lineWidth = 2;
		this.ctx.strokeText(this.fpsCounter.toString(), 670, 10);
		this.ctx.fillText(this.fpsCounter.toString(), 670, 10);
	}
}
