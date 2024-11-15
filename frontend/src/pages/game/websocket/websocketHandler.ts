import { WsGameState } from "../../../interfaces/IWSMessages";
import {
	IPlayer as FrontIPlayer,
	IDeletedItem,
	IItems,
	IOtherPlayer,
	IPlayer,
} from "../interfaces/gameInterfaces";
import { ClientPrediction } from "../tools/clientPrediction";
import {
	otherPlayerConverter,
	playerConverter,
} from "../tools/playerConverter";
import { InterpolateHandler } from "../tools/playerInterpolater";

export class WebSocketHandler {
	public handleGameState(
		e: WsGameState,
		players: Array<FrontIPlayer | IOtherPlayer>,
		items: Array<IItems>,
		lastDeletedItems: Array<IDeletedItem>,
		username: string
	): { items: Array<IItems>; deletedItems: Array<IDeletedItem> } {
		if (players.length > e.entities.players.length) {
			console.log("removing no active players");
			const removeIndexes = [];
			for (let index = 0; index < players.length; index++) {
				const thisUser = players[index];
				const foundIndex = e.entities.players.findIndex(
					(p) => p.id === thisUser.id
				);
				if (foundIndex === -1) {
					removeIndexes.push(index);
				}
			}
			for (const i of removeIndexes) {
				players.splice(i, 1);
			}
		}
		for (const player of e.entities.players) {
			const i = players.findIndex((p) => p.id === player.id);
			const clientPlayer: IPlayer | IOtherPlayer | undefined = players[i];
			const serverPlayer = playerConverter(
				player,
				clientPlayer,
				username
			);
			if (i === -1) {
				// É UM NOVO USUÁRIO, AINDA NÃO FOI RENDERIZADO NENHUMA VEZ.
				console.log("[pushing players]: " + serverPlayer.username);
				if (serverPlayer.canControl) {
					players.push(serverPlayer);
				} else {
					players.push(
						otherPlayerConverter(
							serverPlayer,
							serverPlayer.x,
							serverPlayer.y
						)
					);
				}
				//
			} else if (
				!serverPlayer.canControl ||
				serverPlayer.username !== username
			) {
				if (serverPlayer.alive) {
					const otherP = players[i] as IOtherPlayer;
					InterpolateHandler.update(otherP, serverPlayer);
					players[i] = otherP;
				} else {
					// player is not alive, removing...
					const pIndex = players.findIndex(
						(p) => p.id === serverPlayer.id
					);
					if (pIndex !== -1) {
						players.splice(pIndex, 1);
					}
				}
			} else {
				// CONTROLLABLE USER

				const frontP = clientPlayer as FrontIPlayer;
				const result = ClientPrediction.detectDiferences(
					frontP,
					serverPlayer
				);

				if (result) {
					console.log(
						"need reconciliation - results greater than " +
							result.move +
							" will be in conflict queue"
					);

					console.log("before reconciliation");
					console.log(
						"moveNumber",
						frontP.moveNumber,
						"x",
						frontP.x,
						"y",
						frontP.y,
						"velocities.vx",
						frontP.velocities.vx,
						"velocities.vy",
						frontP.velocities.vy
					);

					frontP.conflictQueue = frontP.moves.filter((m) => {
						if (m.move > result.move) {
							return m;
						}
						return undefined;
					});
					frontP.moves = [];
					frontP.x = result.x;
					frontP.y = result.y;
					frontP.velocities.vx = result.velocities.vx;
					frontP.velocities.vy = result.velocities.vy;
					frontP.moveNumber = result.move;
					frontP.items = serverPlayer.items;
					frontP.rotationAcceleration =
						serverPlayer.rotationAcceleration;
					frontP.rotation = serverPlayer.rotation;

					// players[i] = frontP;
					console.log("after reconciliation");
					console.log(
						"moveNumber",
						frontP.moveNumber,
						"x",
						frontP.x,
						"y",
						frontP.y,
						"velocities.vx",
						frontP.velocities.vx,
						"velocities.vy",
						frontP.velocities.vy
					);
				} else {
					if (frontP.moves.length > 1) {
						frontP.moves = frontP.moves.filter(
							(m) => serverPlayer.moveNumber <= m.move
						);
						players[i] = frontP;
					}
				}
			}
		}

		if (e.entities.items.length < items.length) {
			const itemsRef: Array<IItems> = [];
			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				const index = e.entities.items.findIndex(
					(i) => i.id === item.id
				);
				console.log("item.id", item.id, "	item.type", item.type);

				if (index === -1) {
					console.log("item não existe no backend. index -1");

					// item foi deletado!
					if (item.type !== 1) {
						console.log("item.type !== 1");
						const itemIndex = lastDeletedItems.findIndex(
							(i) => i.id === item.id
						);
						if (itemIndex === -1) {
							console.log("push no 'DeletedItems'");
							lastDeletedItems.push({
								id: item.id,
								height: item.height,
								ttl: 10,
								width: item.width,
								x: item.x,
								y: item.y,
								particles: [],
							});
						} else {
							console.log(lastDeletedItems)
							console.log('não adicionado.')
						}
					}
				} else {
					// item não foi deletado
					itemsRef.push(item);
					console.log("item não deletado");
				}
			}
			items = itemsRef;
		}
		for (const item of e.entities.items) {
			const index = items.findIndex((i) => i.id === item.id);
			if (index === -1) {
				items[items.length] = item;
			} else {
				items[index] = item;
			}
		}
		return { items: items, deletedItems: lastDeletedItems };
	}
}
