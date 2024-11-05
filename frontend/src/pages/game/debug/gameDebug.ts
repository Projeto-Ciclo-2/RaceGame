import { IBox, IPlayer } from "../interfaces/gameInterfaces";

export class GameDebug {
	private ctx: CanvasRenderingContext2D;

	private gridPad = 20;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
	}

	public makeHitBox(hitBox: Array<IBox>) {
		this.ctx.fillStyle = "#cd853f99";
		for (const x of hitBox) {
			this.ctx.fillRect(x.x, x.y, x.width, x.height);
		}
	}

	public renderBoxes(boxes: Array<IBox>, style: string) {
		this.ctx.fillStyle = style;
		for (const x of boxes) {
			this.ctx.fillRect(x.x, x.y, x.width, x.height);
		}
	}

	public renderPlayerInfo(players: Array<IPlayer>) {
		this.ctx.fillStyle = "white";
		this.ctx.strokeStyle = "black";
		this.ctx.lineWidth = 2;
		this.ctx.font = "16px Arial";

		players.forEach((player, index) => {
			const baseYPosition = 20 + index * 100;
			const playerTitle = `Player ${index + 1}`;
			const playerInfo = [
				`Rotation: ${player.rotation}`,
				`Position: (${player.x.toFixed(2)}, ${player.y.toFixed(2)})`,
			];

			// Draw title with border
			this.ctx.strokeText(playerTitle, 570, baseYPosition);
			this.ctx.fillText(playerTitle, 570, baseYPosition);

			// Draw each info line below the title
			playerInfo.forEach((info, lineIndex) => {
				const yPosition = baseYPosition + 20 * (lineIndex + 1);
				this.ctx.strokeText(info, 570, yPosition);
				this.ctx.fillText(info, 570, yPosition);
			});
		});
	}

	public makeGrid() {
		this.ctx.fillStyle = "black";
		for (
			let index = 0;
			index <= this.ctx.canvas.width;
			index += this.gridPad
		) {
			if (index === this.ctx.canvas.width) index--;
			this.ctx.fillRect(index, 0, 1, this.ctx.canvas.height);
		}
		for (
			let index = 0;
			index <= this.ctx.canvas.height;
			index += this.gridPad
		) {
			if (index === this.ctx.canvas.height) index--;
			this.ctx.fillRect(0, index, this.ctx.canvas.width, 1);
		}
	}

	public renderCollidedBoxes(boxCollided: Array<IBox>) {
		this.ctx.fillStyle = "#FFF000AA";
		for (const box of boxCollided) {
			this.ctx.fillRect(box.x, box.y, box.width, box.height);
		}
	}

	public renderPlayerHitBox(
		x: number,
		y: number,
		width: number,
		height: number
	): void {
		this.ctx.fillStyle = "#FA000080";
		this.ctx.fillRect(x, y, width, height);
	}

	public renderDebugInfo(player: IPlayer, x: number) {
		this.ctx.font = "16px Arial";
		this.ctx.fillStyle = "white";
		this.ctx.strokeStyle = "black";
		this.ctx.lineWidth = 2;

		const items = JSON.stringify(player.items.map((i) => i.id));

		const debugText = [
			`player: ${player.username}`,
			`Velocities:`,
			`vx: ${player.velocities.vx}`,
			`vy: ${player.velocities.vy}`,
			`done_laps: ${player.done_laps}`,
			`checkpoint: ${player.checkpoint}`,
			// `rotation: ${player.rotation}`,
			// `id: ${player.id}`,
			// `username: ${player.username}`,
			`items: ${items}`,
			`using nitro: ${player.usingNitro}`,
			`nitro used at: ${player.nitroUsedAt}`,
		];

		debugText.forEach((text, index) => {
			const yPosition = 20 + index * 20;
			this.ctx.strokeText(text, x, yPosition);
			this.ctx.fillText(text, x, yPosition);
		});
	}

	public renderKeyInfo(keys: object) {
		const x = 10;
		const y = 400;

		this.ctx.fillStyle = "white";
		this.ctx.strokeStyle = "black";
		this.ctx.lineWidth = 2;
		this.ctx.font = "16px Arial";

		const keysTitle = "Key Status:";
		const keysInfo = Object.entries(keys).map(
			([key, isPressed]) => `${key}: ${isPressed}`
		);

		// Draw title with border
		this.ctx.strokeText(keysTitle, x, y); // Adjust position as needed
		this.ctx.fillText(keysTitle, x, y);

		// Render each key status
		keysInfo.forEach((info, index) => {
			const yPosition = y + (index + 1) * 20; // Space each line
			this.ctx.strokeText(info, x, yPosition);
			this.ctx.fillText(info, x, yPosition);
		});
	}
}
