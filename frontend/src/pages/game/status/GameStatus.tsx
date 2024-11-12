import React from "react";
import { IPlayer } from "../../../interfaces/IRoom";
import "./gameStatus.css";
import { src } from "../../../assets/enum/enumSrc";
import { sortPlayers } from "../tools/sortPlayers";

export default function GameStatus(props: {
	players: Array<IPlayer>;
	username: string | undefined;
	laps: number | undefined;
}) {
	const me = React.useMemo<IPlayer | undefined>(() => {
		if (props.players.length > 0 && props.username) {
			const myself = props.players.find(
				(p) => p.username === props.username
			);
			console.log("me [memo]");
			return myself;
		}
		return undefined;
	}, [props.players, props.username]);

	const myPosition = React.useRef(0);

	const sortedPlayers = React.useMemo<Array<IPlayer>>(() => {
		if (props.players.length > 0) {
			const tempPlayers = sortPlayers(props.players);
			if (me) {
				const index = tempPlayers.findIndex((p) => p.id === me.id);
				if (index !== -1) {
					myPosition.current = index + 1;
				}
			}
			console.log("[myPosition] " + myPosition.current);
			console.log("sortedPlayers [memo]");

			return tempPlayers;
		}
		return [];
	}, [props.players, me]);

	return (
		<div id="gameStatus">
			<div id="gameStatusMe">
				<p>
					<span>LAPS</span>
					<span>
						{me ? me.done_laps : 0} /{" "}
						{props.laps ? props.laps : "?"}
					</span>
				</p>
				<div
					className={
						me && me.usingNitro ? "usingNitro" : "noUsingNitro"
					}
					id="gameStatusMeNitro"
				>
					<span>{me ? me.items.length : "0"} / 3</span>
					<img src={src.nitro} alt="Nitro" />
				</div>
			</div>
			<div id="gameStatusPlayers">
				{sortedPlayers.map((p, i) => {
					return (
						<section key={p.id} className={me?.id === p.id ? "isMe" : ""}>
							<div>
								<span>{i + 1}º</span>
								<p>
									<span>{p.username.slice(0, 15)}</span>
									<span>{p.done_laps} voltas</span>
								</p>
							</div>
							<img
								src={
									me?.id === p.id ? src.carBlue : src.carGreen
								}
								alt="car"
							/>
						</section>
					);
				})}
			</div>
		</div>
	);
}
