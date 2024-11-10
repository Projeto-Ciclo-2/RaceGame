import {
	IBox,
	ICheckPoint,
	IFinishLine,
	IItems,
	IPlayer,
} from "../interfaces/gameInterfaces";
import { CollisionDetector } from "../tools/collisionDetect";
import { CarController } from "./carController";

export class MapController {
	private canvas: HTMLCanvasElement;
	private carController: CarController;
	private collisionDetector = new CollisionDetector();

	private itemRespawnTime = 5000;
	private spawn = {
		x: 380,
		y: 540,
	};
	private finishLine: IFinishLine = {
		checkpointsNeeded: 5,
		x: 330,
		y: 500,
		width: 37,
		height: 80,
	};

	private walls: Array<IBox> = [
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
		{ x: 150, y: 320, width: 30, height: 190 },
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
	private checkPoints: Array<ICheckPoint> = [
		{ order: 1, x: 50, y: 400, width: 80, height: 20 },
		{ order: 2, x: 140, y: 100, width: 80, height: 20 },
		{ order: 3, x: 540, y: 300, width: 80, height: 20 },
		{ order: 4, x: 640, y: 300, width: 80, height: 20 },
		{ order: 5, x: 420, y: 500, width: 20, height: 80 },
	];

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.carController = new CarController();
		this.carController.listen();
	}

	public _getCarKeys() {
		return this.carController._getKeys();
	}

	public makePrediction(players: Array<IPlayer>, items: Array<IItems>) {
		let changed = false;
		const futurePlayers = players.map((p) => {
			if(p.conflictQueue.length > 0) {
				console.log("p.conflictQueue");
				console.log(JSON.stringify(p.conflictQueue))
			}
			while (p.conflictQueue.length > 0) {
				// console.log("deleting conflict queue");

				const futurePlayer = this.getFuturePlayer(p, items);
				if (this.havePlayerChanged(p, futurePlayer)) {
					p = futurePlayer;
					this.applyMove(futurePlayer);
				}
				p.conflictQueue.pop();
			}

			if (!p.canControl) return p;

			const futurePlayer = this.getFuturePlayer(p, items);
			changed = this.havePlayerChanged(p, futurePlayer);

			if (changed) {
				this.applyMove(futurePlayer);
			}
			return futurePlayer;
		});
		if (changed) {
			players = futurePlayers;
		}
		return {
			players: players,
			items: items,
		};
	}

	private applyMove(player: IPlayer) {
		const { vx, vy } = player.velocities;
		player.moveNumber = player.moveNumber + 1;
		player.moves.push({
			move: player.moveNumber,
			velocities: {
				vx: vx,
				vy: vy,
			},
			x: player.x,
			y: player.y,
		});
	}

	private havePlayerChanged(
		oldPlayer: IPlayer,
		futurePlayer: IPlayer
	): boolean {
		const { x, y, velocities: v } = oldPlayer;
		const { x: newX, y: newY, velocities: newV } = futurePlayer;
		const somethingChange = x !== newX || y !== newY;
		const velocitiesChanged = v.vx !== newV.vx || v.vy !== newV.vy;

		return somethingChange || velocitiesChanged;
	}

	private getFuturePlayer(p: IPlayer, items: Array<IItems>) {
		const futurePlayer = this.updatePlayer(p);
		this.updateCheckpointInPlayer(futurePlayer);
		this.checkPlayerFinishesLap(futurePlayer);
		this.checkPlayerGetsItem(futurePlayer, items);
		return futurePlayer;
	}

	public getWalls(): Array<IBox> {
		return this.walls;
	}

	public getCheckPoints(): Array<ICheckPoint> {
		return this.checkPoints;
	}

	public getFinishLine(): IFinishLine {
		return this.finishLine;
	}

	private updatePlayer(p: IPlayer): IPlayer {
		const futurePlayer = this.carController.getFutureCarPosition(p);

		const result = this.collisionDetector.detect(futurePlayer, this.walls);
		if (typeof result !== "boolean") {
			if (result.length === 1) {
				this.collisionDetector.resolveCollision(
					p,
					futurePlayer,
					result[0],
					true,
					false
				);
			} else {
				result.forEach((box, i, arr) => {
					if (i === arr.length - 1) {
						return this.collisionDetector.resolveCollision(
							p,
							futurePlayer,
							box,
							true,
							true
						);
					}
					this.collisionDetector.resolveCollision(
						p,
						futurePlayer,
						box,
						false,
						false
					);
				});
			}
		} else {
			futurePlayer.disableArrow = {
				down: false,
				up: false,
				left: false,
				right: false,
			};
		}

		this.checkPlayerInsideMap(futurePlayer);
		return futurePlayer;
	}

	private updateCheckpointInPlayer(p: IPlayer) {
		const result = this.collisionDetector.detect(p, this.checkPoints) as
			| boolean
			| Array<ICheckPoint>;
		if (typeof result !== "boolean") {
			const box = result[0];
			if (p.checkpoint === box.order - 1 || p.checkpoint === box.order) {
				if (p.checkpoint === box.order - 1) {
					p.checkpoint++;
				}
			} else {
				this.collisionDetector.resolveCollision(p, p, box, true, false);
			}
		}
	}

	private checkPlayerFinishesLap(p: IPlayer) {
		const collidedBoxes = this.collisionDetector.detect(p, [
			this.finishLine,
		]) as boolean | Array<IFinishLine>;
		if (typeof collidedBoxes !== "boolean") {
			const finishLine = collidedBoxes[0];
			if (
				p.checkpoint === finishLine.checkpointsNeeded ||
				p.checkpoint === 0
			) {
				if (p.checkpoint === finishLine.checkpointsNeeded) {
					p.checkpoint = 0;
					p.done_laps++;
				}
			} else {
				this.collisionDetector.resolveCollision(
					p,
					p,
					finishLine,
					true,
					false
				);
			}
		}
	}

	private checkPlayerGetsItem(p: IPlayer, items: Array<IItems>) {
		const collidedItems = this.collisionDetector.detect(p, items) as
			| boolean
			| Array<IItems>;
		if (typeof collidedItems !== "boolean") {
			const item = collidedItems[0];
			let itemAdded = true;

			if (item.type !== 1) {
				this.carController.useItem(p, item);
			} else {
				itemAdded = this.carController.addNitro(p, item);
			}

			if (itemAdded) {
				const index = items.findIndex((i) => i.id === item.id);
				items.splice(index, 1);
				this.scheduleRespawnForItem(item);
			}
		}
	}

	private scheduleRespawnForItem(item: IItems): void {
		setTimeout(() => {
			// this.items.push(item);
		}, this.itemRespawnTime);
	}

	private checkPlayerInsideMap(player: IPlayer): void {
		if (player.x < 0 || player.x + player.width > this.canvas.width) {
			this.resetPlayer(player);
		}
		if (player.y < 0 || player.y + player.height > this.canvas.height) {
			this.resetPlayer(player);
		}
	}
	private resetPlayer(player: IPlayer): void {
		player.x = this.spawn.x;
		player.y = this.spawn.y;
		player.velocities = {
			vx: 0,
			vy: 0,
		};
		player.checkpoint = 0;
	}
}
