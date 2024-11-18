import React from "react";
import { IPlayer } from "../../interfaces/IRoom";
import { Link, useNavigate } from "react-router-dom";
import { src } from "../../assets/enum/enumSrc";
import "./endScreen.css";
import { sortPlayers } from "../game/tools/sortPlayers";
import { useRoom } from "../../context/RoomContext";
import { calcPercentage } from "./calcPercentage";
import BxsHome from "../../components/icons/home";

export default function EndScreen(props: {
	alive: boolean;
	winner: string;
	me: IPlayer;
	players: Array<IPlayer>;
	laps: number | undefined;
}) {
	const RoomsContext = useRoom();

	const sortedPlayers = React.useMemo<Array<IPlayer>>(() => {
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

	const navigate = useNavigate();

	if (!props.alive) {
		return <></>;
	}

	function navigateToPageHome() {
		navigate("/home");
	}

	return (
		<div id="end-game">
			<div id="back-home" onClick={navigateToPageHome}>
				<BxsHome />
			</div>
			<div id="container">
				<section id="game-result">
					<div id="result">
						{props.winner === props.me.username ? (
							<p style={{ color: "#00ACD6" }}>winner</p>
						) : (
							<p style={{ color: "#FE3704" }}>you lost</p>
						)}
					</div>
					<div
						id="img-result"
						style={{
							backgroundImage:
								props.winner === props.me.username
									? "url('./assets/imgs/img-winner-rac.webp')"
									: "url('./assets/imgs/img-lost-rac.webp')",
						}}
					></div>
				</section>
				<section id="race">
					<div id="race-result">
						<p>race result</p>
						<div>
							<p>laps</p>
							<p>completed</p>
						</div>
					</div>
					<ul>
						{sortedPlayers.map((p, i) => (
							<li key={i}>
								<div id="div1">
									<p className="position-number">{i + 1}</p>
									<p className="username">{p.username}</p>
								</div>
								<div>
									<p className="laps-number">{p.done_laps}</p>
									<p className="completed">
										{calcPercentage(
											p.checkpoint,
											p.done_laps,
											props.laps || 3
										).toFixed(0)}
										%
									</p>
								</div>
							</li>
						))}
					</ul>
				</section>
			</div>
		</div>
	);
}
