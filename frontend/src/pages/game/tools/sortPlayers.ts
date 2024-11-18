import { IPlayer, IPlayerMIN } from "../../../interfaces/IRoom";

export function sortPlayers(
	players: Array<IPlayer | IPlayerMIN>
): Array<IPlayer | IPlayerMIN> {
	return players.sort((a, b) => {
		if (a.done_laps > b.done_laps) return -1;

		if (b.done_laps > a.done_laps) return 1;

		if (a.checkpoint > b.checkpoint) return -1;

		if (b.checkpoint > a.checkpoint) return 1;

		return 0;
	});
}
