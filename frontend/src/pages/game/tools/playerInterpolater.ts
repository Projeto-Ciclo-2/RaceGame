import { IOtherPlayer, IPlayer } from "../interfaces/gameInterfaces";

function interpolate(oldV: number, newV: number, time: number): number {
	return oldV + (newV - oldV) * time;
}
export class InterpolateHandler {
	public static update(oldP: IOtherPlayer, newP: IPlayer) {
		oldP.alive = newP.alive;
		oldP.checkpoint = newP.checkpoint;
		oldP.done_laps = newP.done_laps;
		oldP.nitroDirection = newP.nitroDirection;
		oldP.rotation = newP.rotation;
		oldP.usingNitro = newP.usingNitro;

		oldP.toX = newP.x;
		oldP.toY = newP.y;
	}

	public static interpolate(player: IOtherPlayer, time: number) {
		// console.log("interpolating player...");
		if (player.x !== player.toX) {
			// console.log(
			// 	"[x] " + player.x + " [toX] " + player.toX + " [time] " + time
			// );
			player.x = interpolate(player.x, player.toX, time);
			// console.log("[after x] " + player.x);
		}
		if (player.y !== player.toY) {
			// console.log(
			// 	"[y] " + player.y + " [toY] " + player.toY + " [time] " + time
			// );
			player.y = interpolate(player.y, player.toY, time);
			// console.log("[after y] " + player.y);
		}
	}
}
