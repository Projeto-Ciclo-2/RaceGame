import { IBox, IPlayer } from "../interfaces/gameInterfaces";

export class CollisionDetector {
	public resolveCollision(
		oldPlayer: IPlayer,
		futurePlayer: IPlayer,
		box: IBox
	): void {
		const leftBox = box.x;
		const rightBox = box.x + box.width;
		const topBox = box.y;
		const bottomBox = box.y + box.height;

		const leftFuturePlayer = futurePlayer.x;
		const rightFuturePlayer = futurePlayer.x + futurePlayer.width;
		const topFuturePlayer = futurePlayer.y;
		const bottomFuturePlayer = futurePlayer.y + futurePlayer.height;

		const xPlayerVelocity = futurePlayer.velocities.vx;
		const yPlayerVelocity = futurePlayer.velocities.vy;

		// const leftOldPlayer = oldPlayer.x;
		// const rightOldPlayer = oldPlayer.x + oldPlayer.width;
		// const topOldPlayer = oldPlayer.y;
		// const bottomOldPlayer = oldPlayer.y + oldPlayer.height;

		const xEscapeVelocity = oldPlayer.velocities.vx * -1;
		const yEscapeVelocity = oldPlayer.velocities.vy * -1;

		const escapePosition: {
			up?: number;
			down?: number;
			left?: number;
			right?: number;
		} = {};

		if (xEscapeVelocity > 0) {
			escapePosition.right = rightBox;
		}
		if (xEscapeVelocity < 0) {
			escapePosition.left = leftBox;
		}
		if (yEscapeVelocity > 0) {
			escapePosition.down = bottomBox;
		}
		if (yEscapeVelocity < 0) {
			escapePosition.up = topBox;
		}

		if (typeof escapePosition.up === "number") {
			const deltaY = bottomFuturePlayer - escapePosition.up;
			if (typeof escapePosition.left === "number") {
				const deltaX = rightFuturePlayer - escapePosition.left;
				this.handleDiagonalEscape(
					futurePlayer,
					deltaX,
					deltaY,
					xPlayerVelocity,
					yPlayerVelocity,
					-1,
					-1
				);
			} else if (typeof escapePosition.right === "number") {
				const deltaX = escapePosition.right - leftFuturePlayer;
				this.handleDiagonalEscape(
					futurePlayer,
					deltaX,
					deltaY,
					xPlayerVelocity,
					yPlayerVelocity,
					-1,
					1
				);
			} else {
				futurePlayer.y -= deltaY;
				futurePlayer.velocities.vx = 0;
				futurePlayer.velocities.vy = 0;
			}
		} else if (typeof escapePosition.down === "number") {
			const deltaY = escapePosition.down - topFuturePlayer;
			if (typeof escapePosition.left === "number") {
				const deltaX = rightFuturePlayer - escapePosition.left;
				this.handleDiagonalEscape(
					futurePlayer,
					deltaY,
					deltaX,
					yPlayerVelocity,
					xPlayerVelocity,
					1,
					-1
				);
			} else if (typeof escapePosition.right === "number") {
				const deltaX = escapePosition.right - leftFuturePlayer;
				this.handleDiagonalEscape(
					futurePlayer,
					deltaY,
					deltaX,
					yPlayerVelocity,
					xPlayerVelocity,
					1,
					1
				);
			} else {
				futurePlayer.y += deltaY;
				futurePlayer.velocities.vx = 0;
				futurePlayer.velocities.vy = 0;
			}
		} else if (typeof escapePosition.left === "number") {
			const deltaX = rightFuturePlayer - escapePosition.left;
			futurePlayer.x -= deltaX;
			futurePlayer.velocities.vx = deltaX;
		} else if (typeof escapePosition.right === "number") {
			const deltaX = escapePosition.right - leftFuturePlayer;
			futurePlayer.x += deltaX;
			const newSpeed = Math.abs(futurePlayer.velocities.vx) / 2;
			futurePlayer.velocities.vx = newSpeed;
		}
	}

	private handleDiagonalEscape(
		player: IPlayer,
		deltaA: number,
		deltaB: number,
		velocityA: number,
		velocityB: number,
		multiplierA: number = 1,
		multiplierB: number = 1
	) {
		const result = this.whichWillHappenFirst(
			deltaA,
			velocityA,
			deltaB,
			velocityB
		);
		if (result === "a") {
			player.x += deltaA * multiplierB;
			player.y +=
				((deltaA * Math.abs(velocityB)) / Math.abs(velocityA)) *
				multiplierA;
			player.velocities.vx = 0;
			player.velocities.vy = 0;
		} else {
			player.x +=
				((deltaB * Math.abs(velocityA)) / Math.abs(velocityB)) *
				multiplierB;
			player.y += deltaB * multiplierA;
			player.velocities.vx = 0;
			player.velocities.vy = 0;
		}
	}

	private whichWillHappenFirst(
		a: number,
		velocityA: number,
		b: number,
		velocityB: number
	): "a" | "b" {
		const xTime = Math.abs(a) / Math.abs(velocityA);
		const yTime = Math.abs(b) / Math.abs(velocityB);
		return xTime < yTime ? "a" : "b";
	}

	private figureOutDirection(xEscape: number, yEscape: number) {}

	private predictCollision(player: IPlayer, box: IBox): void {}
}
