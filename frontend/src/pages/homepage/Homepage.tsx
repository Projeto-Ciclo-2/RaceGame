import React from "react";
import Helmet from "../../assets/icons/Helmet";
import SpeedDialComponent from "../../components/speed-dial/SpeedDial";
import "./Homepage.css";

const Homepage = () => {
	const rooms = [
		{
			id: "dad23gg2",
			status: "waiting",
			playersOn: 2,
			totalPlayers: 4,
			labs: 4,
		},
		{
			id: "dad23gg2",
			status: "racing",
			playersOn: 2,
			totalPlayers: 4,
			labs: 4,
		},
		{
			id: "dad23gg2",
			status: "waiting",
			playersOn: 2,
			totalPlayers: 4,
			labs: 4,
		},
		{
			id: "dad23gg2",
			status: "racing",
			playersOn: 2,
			totalPlayers: 4,
			labs: 4,
		},
	];

	return (
		<section id="homepage">
			<section id="content-homepage">
				<SpeedDialComponent />
				<div id="content-title">
					<h2>It’s Racing Time!</h2>
					<p>Grab your helmet and fast your seatbelt!</p>
				</div>
				<div id="content-table">
					<table>
						<thead>
							<tr>
								<th>id</th>
								<th>status</th>
								<th>players</th>
								<th>labs</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{rooms.map((room, index) => (
								<tr key={index}>
									<td>{room.id}</td>
									{room.status === "waiting" ? (
										<td className="waiting">
											{room.status}
										</td>
									) : (
										<td>{room.status}</td>
									)}
									<td>{`${room.playersOn}/${room.totalPlayers}`}</td>
									<td>{room.labs}</td>
									{room.status === "waiting" ? (
										<td>
											<button>join</button>
										</td>
									) : (
										<td>
											<Helmet />
										</td>
									)}
								</tr>
							))}
						</tbody>
					</table>
					<button>Create Race</button>
				</div>
			</section>
		</section>
	);
};

export default Homepage;
