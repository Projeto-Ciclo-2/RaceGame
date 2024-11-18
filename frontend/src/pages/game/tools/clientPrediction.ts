import { IPlayer as BackIPlayer } from "../../../interfaces/IRoom";
import { IMoves, IPlayer as FrontIPlayer } from "../interfaces/gameInterfaces";

export class ClientPrediction {
	static createMoveObj(serverPlayer: BackIPlayer): IMoves {
		return {
			move: serverPlayer.moveNumber,
			itemsAmount: serverPlayer.items.length,
			rotation: serverPlayer.rotation,
			rotationAcceleration: serverPlayer.rotationAcceleration,
			velocities: {
				vx: serverPlayer.velocities.vx,
				vy: serverPlayer.velocities.vy,
			},
			x: serverPlayer.x,
			y: serverPlayer.y,
		};
	}
	static detectDiferences(
		clientPlayer: FrontIPlayer,
		serverPlayer: BackIPlayer
	): null | IMoves {
		let diferences: null | IMoves = null;

		// console.log("%%% init detectDiferences %%%");

		if (
			clientPlayer.moves.length > 0 &&
			serverPlayer.moveNumber >
				clientPlayer.moves[clientPlayer.moves.length - 1].move
		) {
			console.log("-=server bellow client.=-");
			return ClientPrediction.createMoveObj(serverPlayer);
		}

		clientPlayer.moves.forEach((move) => {
			if (serverPlayer.moveNumber === move.move) {
				// console.log("checking move " + move.move);
				if (
					move.x !== serverPlayer.x ||
					move.y !== serverPlayer.y ||
					move.velocities.vx !== serverPlayer.velocities.vx ||
					move.velocities.vy !== serverPlayer.velocities.vy ||
					move.itemsAmount !== serverPlayer.items.length ||
					move.rotation !== serverPlayer.rotation ||
					move.rotationAcceleration !==
						serverPlayer.rotationAcceleration
				) {
					console.log("[different] move nº" + move.move);
					if (!diferences) {
						// console.log("(client)");
						// console.log(
						// 	move.move,
						// 	move.x,
						// 	move.y,
						// 	move.velocities.vx,
						// 	move.velocities.vy
						// );
						// console.log("(server)");
						// console.log(
						// 	serverPlayer.moveNumber,
						// 	serverPlayer.x,
						// 	serverPlayer.y,
						// 	serverPlayer.velocities.vx,
						// 	serverPlayer.velocities.vy
						// );
						diferences =
							ClientPrediction.createMoveObj(serverPlayer);
					}
				}
			}
		});
		// console.log("&&& end detectDiferences &&&");

		return diferences;
	}
}
