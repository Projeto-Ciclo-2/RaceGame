import { IPlayer as BackIPlayer } from "../../../interfaces/IRoom";
import { IMoves, IPlayer as FrontIPlayer } from "../interfaces/gameInterfaces";

export class ClientPrediction {
	static createMoveObj(serverPlayer: BackIPlayer): IMoves {
		return {
			move: serverPlayer.moveNumber,
			velocities: serverPlayer.velocities,
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
					move.velocities.vy !== serverPlayer.velocities.vy
				) {
					console.log("[different] move nº" + move.move);
					if (!diferences) {
						diferences =
							ClientPrediction.createMoveObj(serverPlayer);
						console.log("(client)");
						console.log(
							move.move,
							move.x,
							move.y,
							move.velocities.vx,
							move.velocities.vy
						);
						console.log("(server)");
						console.log(
							diferences.move,
							diferences.x,
							diferences.y,
							diferences.velocities.vx,
							diferences.velocities.vy
						);
					}
				}
			}
		});
		// console.log("&&& end detectDiferences &&&");

		return diferences;
	}
}
