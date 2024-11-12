import { IPlayer } from "../interfaces/gameInterfaces";

export class EndScreen {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private wheelImage: HTMLImageElement | undefined;
	private players: IPlayer[] | undefined;
	private winnerName: string | undefined;
	private angle: number = 0;
	private isSpinning: boolean = true;

	private alive = true;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d")!;
	}

	public dismount() {
		this.alive = false;
	}

	public start(
		wheelSvg: HTMLImageElement | undefined,
		players: IPlayer[],
		winnerName: string
	) {
		this.wheelImage = wheelSvg;
		this.players = players;
		this.winnerName = winnerName;
		this.animate();
	}

	private drawWheel() {
		const { width, height } = this.canvas;
		const x = width * 0.2;
		const y = height * 0.4;

		this.ctx.save();
		this.ctx.translate(x, y);
		this.ctx.rotate(this.angle);
		this.ctx.drawImage(this.wheelImage!, -150 / 2, -150 / 2, 150, 150);
		this.ctx.restore();
	}

	private drawText() {
		const { width } = this.canvas;

		this.ctx.font = "700 30px 'Roboto'";
		this.ctx.textAlign = "center";
		this.ctx.fillStyle = "white";

		// Draw "Game Ended"
		this.ctx.fillText("Game Ended", width * 0.2, 50);

		// Draw winner's name
		this.ctx.font = "500 25px 'Roboto'";
		this.ctx.fillText(`Winner: ${this.winnerName}`, width * 0.2, 90);
	}

	private drawScore() {
		this.ctx.font = "300 20px 'Roboto'";
		this.ctx.fillStyle = "white";
		this.ctx.textAlign = "left";

		this.ctx.fillText("Results", 500, 100);
		this.players!.forEach((player, index) => {
			const text = `${player.username.slice(0, 15)}: ${player.done_laps} laps`;
			this.ctx.fillText(text, 500, 150 + index * 30);
		});
	}

	private animate = () => {
		if (!this.players || !this.winnerName) {
			console.error("players or winner name not found.");
			return;
		}
		if (!this.wheelImage) {
			return requestAnimationFrame(this.animate);
		}
		if (!this.alive) {
			return;
		}
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		if (this.isSpinning) {
			this.angle += 0.05; // Adjust the speed of the spin here
		}

		this.drawWheel();
		this.drawText();
		this.drawScore();

		requestAnimationFrame(this.animate);
	};

	public stopSpin() {
		this.isSpinning = false;
	}
}
