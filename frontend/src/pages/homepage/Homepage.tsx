import React from "react";
import Helmet from "../../assets/icons/Helmet";
import SpeedDialComponent from "../../components/speed-dial/SpeedDial";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";
import RoomsList from "./roomsList";
const Homepage = () => {
	const rooms = [
		{
			id: "dad23gg2",
			status: "waiting",
			playersOn: 2,
			totalPlayers: 4,
			laps: 4,
		},
		{
			id: "dad23gg2",
			status: "racing",
			playersOn: 2,
			totalPlayers: 4,
			laps: 4,
		},
		{
			id: "dad23gg2",
			status: "waiting",
			playersOn: 2,
			totalPlayers: 4,
			laps: 4,
		},
		{
			id: "dad23gg2",
			status: "racing",
			playersOn: 2,
			totalPlayers: 4,
			laps: 4,
		},
	];
	const navigate = useNavigate();
	return (
		<section id="homepage">
			<section id="content-homepage">
				<SpeedDialComponent />
				<div id="content-title">
					<h2>It’s Racing Time!</h2>
					<p>Grab your helmet and fast your seatbelt!</p>
				</div>
				<div id="body-room-list">
					<div id="room-list">
						<div id="room-list-head">
							<h3>Id</h3>
							<h3>Status</h3>
							<h3>Players</h3>
							<h3>Laps</h3>
							<h3 id="blank"></h3>
						</div>
						<div id="room-list-body">
							{rooms.map((room, index) => (
								<RoomsList key={index} room={room} index={index}/> 
							))}
						</div>
					</div>
					<button onClick={() => navigate("/lobby")}>
						Create Race
					</button>
				</div>
			</section>
		</section>
	);
};

export default Homepage;
