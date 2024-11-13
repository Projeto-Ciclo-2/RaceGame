import React from "react";
import { IPlayer } from "../../interfaces/IRoom";
import { Link } from "react-router-dom";
import { src } from "../../assets/enum/enumSrc";
import "./endScreen.css";
import { sortPlayers } from "../game/tools/sortPlayers";

export default function EndScreen(props: {
	alive: boolean;
	winner: string;
	me: IPlayer;
	players: Array<IPlayer>;
	laps: number | undefined;
}) {
	const sortedPlayers = React.useMemo<Array<IPlayer>>(() => {
		if (props.players.length > 0) {
			const tempPlayers = sortPlayers(props.players);
			return tempPlayers;
		}
		return [];
	}, [props.players]);

	if (!props.alive) {
		return <></>;
	}
	return (
		<div id="container">
			<div id="endScreen">
				<p>
					{props.winner === props.me.username
						? "Victory"
						: "Game Over"}
				</p>
				<img src={src.wheel} alt="wheel" />
				<Link id="endScreenBTN" to={"/home"}>
					Voltar ao início
				</Link>
			</div>
			<div id="endScreenTable">
				{sortedPlayers.map((p, i) => {
					return (
						<section
							key={p.id}
							className={props.me?.id === p.id ? "isMe" : ""}
						>
							<p>
								<span>{i + 1}º</span>
								<span>{p.username}</span>
							</p>
							<span>
								{p.done_laps} voltas{" "}
								{p.done_laps >= (props.laps || 3)
									? 100
									: (
											(p.checkpoint /
												(6 * (props.laps || 3))) *
											100
									  ).toFixed(0)}
								% concluído
							</span>
						</section>
					);
				})}
			</div>
		</div>
	);
}
