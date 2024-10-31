import { config } from "../../config/config";

type typeOptions = "ArrowRight" | "ArrowLeft" | "ArrowUp" | "ArrowDown";
interface IPlayer {
	canControl: boolean;
	x: number;
	y: number;
}

export class GameController {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	private bkg: CanvasImageSource;

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

	private width = 30;
	private height = 15;
	private velocity = 5;

	private options = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
	private keys = {
		ArrowLeft: false,
		ArrowRight: false,
		ArrowUp: false,
		ArrowDown: false,
	};

	private players: Array<IPlayer> = [{ canControl: true, x: 380, y: 540 }];

	constructor(canvas: HTMLCanvasElement, bkg: CanvasImageSource) {
		this.canvas = canvas;
		this.bkg = bkg;
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
			this.makeGrid();
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

			const diagonalTurnLeft =
				(this.keys.ArrowUp && this.keys.ArrowLeft) ||
				(this.keys.ArrowDown && this.keys.ArrowRight);
			const diagonalTurnRight =
				(this.keys.ArrowUp && this.keys.ArrowRight) ||
				(this.keys.ArrowDown && this.keys.ArrowLeft);
			const diagonalPress = diagonalTurnLeft || diagonalTurnRight;

			let degree = diagonalTurnLeft ? 45 : diagonalTurnRight ? 135 : 0;

			if (
				(!diagonalPress && this.keys.ArrowUp) ||
				(!diagonalPress && this.keys.ArrowDown)
			) {
				degree = 90;
			}
			this.ctx.rotate((degree * Math.PI) / 180);

			this.ctx.fillStyle = "red";
			this.ctx.fillRect(
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
				if (this.validateMove(p)) return this.updatePosition(p);
			}
			return p;
		});
	}

	private updatePosition(player: IPlayer): IPlayer {
		const tempPlayer = Object.assign({}, player);

		if (this.keys.ArrowUp) {
			tempPlayer.y += this.velocity * -1;
		}
		if (this.keys.ArrowDown) {
			tempPlayer.y += this.velocity;
		}
		if (this.keys.ArrowLeft) {
			tempPlayer.x += this.velocity * -1;
		}
		if (this.keys.ArrowRight) {
			tempPlayer.x += this.velocity;
		}
		return tempPlayer;
	}

	private validateMove(player: IPlayer): boolean {
		const tempPlayer = this.updatePosition(player);
		const valid = this.hitBox.every((box) => {
			const playerLeftMerge = tempPlayer.x + this.width > box.x;
			const playerRightMerge = tempPlayer.x < box.x + box.width;
			const horizontalMerge = playerLeftMerge && playerRightMerge;

			const playerTopMerge = tempPlayer.y + this.height > box.y;
			const playerBottomMerge = tempPlayer.y < box.y + box.height;
			const verticalMerge = playerTopMerge && playerBottomMerge;

			return !horizontalMerge || !verticalMerge;
		});
		return valid;
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

	private handleKeyPress(e: KeyboardEvent, alive: boolean) {
		if (this.options.includes(e.key)) {
			const key = e.key as any as typeOptions;
			this.keys[key] = alive;
		}
	}
}
