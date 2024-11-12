import { IOtherPlayer } from "../interfaces/gameInterfaces";

function interpolate(oldV: number, newV: number, time: number): number {
	return oldV + (newV - oldV) * time;
}
export class PlayerInterpolate {
	public static action(player: IOtherPlayer, time: number) {
		console.log("interpolating player...");
		if (player.x !== player.toX) {
			console.log(
				"[x] " + player.x + " [toX] " + player.toX + " [time] " + time
			);
			player.x = interpolate(player.x, player.toX, time);
			console.log("[after x] " + player.x);
		}
		if (player.y !== player.toY) {
			console.log(
				"[y] " + player.y + " [toY] " + player.toY + " [time] " + time
			);
			player.y = interpolate(player.y, player.toY, time);
			console.log("[after y] " + player.y);
		}
	}
}
