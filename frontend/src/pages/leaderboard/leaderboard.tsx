import React, { useEffect, useState } from "react";
import "./leaderboard.css";
import Trophy from "../../components/icons/trophy";
import RaceFlags from "../../components/icons/raceFlags";
import UserRanking from "../../components/other/userRanking";
import Car2 from "../../components/svg/car2";
import BxsHome from "../../components/icons/home";
import { useNavigate } from "react-router-dom";
import { UserAPI } from "../../api/users";

interface Player{
	username: string;
	wins: number;
	picked_items: number;
	played_games: number;
}
const LeaderBoard = () => {
	const [order, setOrder] = useState<Player[]>([])
	const navigate = useNavigate()
	const apiUser = new UserAPI();

	const home = () => {
		navigate("/home")
	}
	function rankingPlayers(players: Player[]): Player[]{
        return players.sort((a: Player, b: Player) => {
            if(a.wins > b.wins) return -1;
            if(a.wins < b.wins) return 1;
           
            if(a.picked_items > b.picked_items) return -1;
            if(a.picked_items < b.picked_items) return 1;


            if(a.played_games < b.played_games) return -1;
            if(a.played_games > b.played_games) return 1;


            return 0;
        })
    }
	useEffect(() => {
        async function fetchUsers() {
            try{
                const response = await apiUser.Ranking();
                if(response.statusCode !== 200){
					throw new Error("Ocorreu um erro ao buscar dados, tente mais tarde")
                }
                const data = response.data;
                const sortedRanking = rankingPlayers(data)
                const ranking = sortedRanking.slice(0, 9);
                setOrder(ranking)
            } catch(error) {
                console.error("Erro: ", error)
            }
        }
        fetchUsers();
    }, [])

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
						{order.map((player, index) => (
							<UserRanking
								key={index}
								driver={player}
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
