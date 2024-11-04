import { IBox, IPlayer } from "../interfaces/gameInterfaces";

export class CollisionDetector {
	public detect(player: IPlayer, boxes: Array<IBox>): true | Array<IBox> {
		const futurePlayer = Object.assign({}, player);
		const mergedBoxes: Array<IBox> = boxes.filter((box) => {
			const playerRightBiggerThanBox =
				futurePlayer.x + futurePlayer.width > box.x;
			const playerLeftShorterThanBox = futurePlayer.x < box.x + box.width;
			const horizontalMerge =
				playerRightBiggerThanBox && playerLeftShorterThanBox;

			const playerBottomBiggerThanBox =
				futurePlayer.y + futurePlayer.height > box.y;
			const playerTopShortenThanBox = futurePlayer.y < box.y + box.height;
			const verticalMerge =
				playerBottomBiggerThanBox && playerTopShortenThanBox;

			return horizontalMerge && verticalMerge;
		});

		if (mergedBoxes.length > 0) {
			return mergedBoxes;
		}
		return true;
	}

	public resolveCollision(
		oldPlayer: IPlayer,
		futurePlayer: IPlayer,
		box: IBox,
		resetVelocity: boolean,
		hasMultipleCollision: boolean
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

		//==========================================//
		// IF PLAYER PRESSING DOWN AND ESCAPE IS UP //
		//==========================================//
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
					-1,
					resetVelocity,
					hasMultipleCollision
				);
				// if (res === "a") {
				// 	futurePlayer.disableArrow.right = true;
				// } else {
				// 	futurePlayer.disableArrow.down = true;
				// }
			} else if (typeof escapePosition.right === "number") {
				const deltaX = escapePosition.right - leftFuturePlayer;
				this.handleDiagonalEscape(
					futurePlayer,
					deltaX,
					deltaY,
					xPlayerVelocity,
					yPlayerVelocity,
					-1,
					1,
					resetVelocity,
					hasMultipleCollision
				);
				// if (res === "a") {
				// 	futurePlayer.disableArrow.left = true;
				// } else {
				// 	futurePlayer.disableArrow.down = true;
				// }
				//DEFAULT VALUE
			} else {
				futurePlayer.y -= deltaY;
				futurePlayer.disableArrow.down = true;

				if (resetVelocity) {
					const newSpeed =
						(Math.abs(futurePlayer.velocities.vy) / 2) * -1;
					futurePlayer.velocities.vy = newSpeed;
				}
			}
			//==========================================//
			// IF PLAYER PRESSING UP AND ESCAPE IS DOWN //
			//==========================================//
		} else if (typeof escapePosition.down === "number") {
			const deltaY = escapePosition.down - topFuturePlayer;
			if (typeof escapePosition.left === "number") {
				const deltaX = rightFuturePlayer - escapePosition.left;
				this.handleDiagonalEscape(
					futurePlayer,
					deltaX,
					deltaY,
					xPlayerVelocity,
					yPlayerVelocity,
					1,
					-1,
					resetVelocity,
					hasMultipleCollision
				);
				// if (res === "a") {
				// 	futurePlayer.disableArrow.right = true;
				// } else {
				// 	futurePlayer.disableArrow.up = true;
				// }
			} else if (typeof escapePosition.right === "number") {
				const deltaX = escapePosition.right - leftFuturePlayer;
				this.handleDiagonalEscape(
					futurePlayer,
					deltaX,
					deltaY,
					xPlayerVelocity,
					yPlayerVelocity,
					1,
					1,
					resetVelocity,
					hasMultipleCollision
				);
				// if (res === "a") {
				// 	futurePlayer.disableArrow.left = true;
				// } else {
				// 	futurePlayer.disableArrow.up = true;
				// }
				// DEFAULT VALUE
			} else {
				futurePlayer.y += deltaY;
				futurePlayer.disableArrow.up = true;

				if (resetVelocity) {
					const newSpeed = Math.abs(futurePlayer.velocities.vy) / 2;
					futurePlayer.velocities.vy = newSpeed;
				}
			}
			//=================================//
			// ONLY LEFT AND RIGHT ESCAPES NOW //
			//=================================//
		} else if (typeof escapePosition.left === "number") {
			const deltaX = rightFuturePlayer - escapePosition.left;
			futurePlayer.x -= deltaX;
			futurePlayer.disableArrow.right = true;

			if (resetVelocity) {
				const newSpeed =
					(Math.abs(futurePlayer.velocities.vx) / 2) * -1;
				futurePlayer.velocities.vx = newSpeed;
			}
			//
		} else if (typeof escapePosition.right === "number") {
			const deltaX = escapePosition.right - leftFuturePlayer;
			futurePlayer.x += deltaX;
			futurePlayer.disableArrow.left = true;

			if (resetVelocity) {
				const newSpeed = Math.abs(futurePlayer.velocities.vx) / 2;
				futurePlayer.velocities.vx = newSpeed;
			}
		}
	}

	private handleDiagonalEscape(
		player: IPlayer,
		deltaA: number,
		deltaB: number,
		velocityA: number,
		velocityB: number,
		multiplierA: number = 1,
		multiplierB: number = 1,
		resetVelocity: boolean,
		hasMultipleCollision: boolean
	): "a" | "b" {
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

			if (resetVelocity) {
				if (hasMultipleCollision) {
					player.velocities.vy = 0;
				} else {
					player.velocities.vy = player.velocities.vy * 0.93;
				}
				player.y += player.velocities.vy;

				player.velocities.vx = player.velocities.vx * 0.2 * -1;
				// player.velocities.vy = 0;
			}
		} else {
			const res =
				((deltaB * Math.abs(velocityA)) / Math.abs(velocityB)) *
				multiplierB;

			player.x += res;
			player.y += deltaB * multiplierA;

			if (resetVelocity) {
				if (hasMultipleCollision) {
					player.velocities.vx = 0;
				} else {
					player.velocities.vx = player.velocities.vx * 0.93;
				}
				player.x += player.velocities.vx;

				// player.velocities.vx = 0;
				player.velocities.vy = player.velocities.vy * 0.2 * -1;
			}
		}
		return result;
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
}
