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
				this.updatePosition(p);
			}
			return p;
		});
	}

	private updatePosition(player: IPlayer) {
		if (this.keys.ArrowUp) {
			player.y += this.velocity * -1;
		}
		if (this.keys.ArrowDown) {
			player.y += this.velocity;
		}
		if (this.keys.ArrowLeft) {
			player.x += this.velocity * -1;
		}
		if (this.keys.ArrowRight) {
			player.x += this.velocity;
		}
	}

	private makeHitBox() {
		this.ctx.fillStyle = "peru";
		this.ctx.fillRect(0, 0, 60, this.canvas.height);
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
