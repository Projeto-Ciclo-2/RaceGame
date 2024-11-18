import React from "react";
import { IPlayer, IPlayerMIN } from "../../interfaces/IRoom";
import { Link } from "react-router-dom";
import { src } from "../../assets/enum/enumSrc";
import "./endScreen.css";
import { sortPlayers } from "../game/tools/sortPlayers";
import { useRoom } from "../../context/RoomContext";
import { calcPercentage } from "./calcPercentage";

export default function EndScreen(props: {
	alive: boolean;
	winner: string;
	me: IPlayer;
	players: Array<IPlayer | IPlayerMIN>;
	laps: number | undefined;
}) {
	const RoomsContext = useRoom();

	const sortedPlayers = React.useMemo<Array<IPlayer | IPlayerMIN>>(() => {
		if (props.players.length > 0) {
			const tempPlayers = sortPlayers(props.players);
			return tempPlayers;
		}
		return [];
	}, [props.players]);

	function clearThisRoom() {
		RoomsContext.setRooms(
			RoomsContext.rooms.filter(
				(r) => r.id !== RoomsContext.currentRoom?.id
			)
		);
		RoomsContext.reset();
	}

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
				<Link id="endScreenBTN" to={"/home"} onClick={clearThisRoom}>
					Voltar ao início
				</Link>
			</div>
			<div id="endScreenTable">
				{sortedPlayers.map((p, i) => {
					return (
						<section
							key={p.username}
							className={props.me?.username === p.username ? "isMe" : ""}
						>
							<p>
								<span>{i + 1}º</span>
								<span>{p.username}</span>
							</p>
							<span>
								{p.done_laps} voltas{" "}
								{calcPercentage(
									p.checkpoint,
									p.done_laps,
									props.laps || 3
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
