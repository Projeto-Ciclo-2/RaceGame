import React from "react";
import "./leaderboard.css";
import Trophy from "../../components/icons/trophy";
import RaceFlags from "../../components/icons/raceFlags";
import UserRanking from "../../components/other/userRanking";
import Car2 from "../../components/svg/car2";
import BxsHome from "../../components/icons/home";
import { useNavigate } from "react-router-dom";

const LeaderBoard = () => {
	const navigate = useNavigate()
	const mockRanking = [
		{ driver: "player1", wins: 10, items: 10, games: 20 },
		{ driver: "player2", wins: 9, items: 10, games: 15 },
		{ driver: "player3", wins: 8, items: 10, games: 14 },
		{ driver: "player4", wins: 7, items: 10, games: 14 },
		{ driver: "player5", wins: 6, items: 10, games: 12 },
		{ driver: "player6", wins: 5, items: 10, games: 11 },
		{ driver: "player7", wins: 4, items: 10, games: 18 },
		{ driver: "player8", wins: 3, items: 10, games: 19 },
		{ driver: "player9", wins: 2, items: 10, games: 13 },
	];
	const home = () => {
		navigate("/home")
	}
	return (
		<div id="ldb-content">
			<div id="ldb-header">
				<div id="back-home" onClick={home}>
					<BxsHome/>
				</div>
				<div id="ldb-header-logo">
					<Trophy />
					<h1> LeaderBoard</h1>
					<RaceFlags />
				</div>
			</div>
			<div id="ldb-body">
				<div id="ldb-img"><Car2/></div>
				<div id="ldb-body-content">
					<div id="ldb-content-header">
						<h4>Position</h4>
						<h4>Driver </h4>
						<h4>Wins</h4>
						<h4>Items</h4>
						<h4>Games</h4>
					</div>
					<div id="ldb-board">
						{mockRanking.map((user, index) => (
							<UserRanking
								key={index}
								driver={user}
								index={index}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
export default LeaderBoard;
