import React from "react";
import RankIcon from "../icons/rankingOrder";


interface User {
	driver: string;
	wins: number;
	items: number;
	games: number;
}

interface UserRankingProps {
	driver: User;
	index: number;

}

const UserRanking: React.FC<UserRankingProps> = ({
	driver,
	index,
}) => {
	
	const top3 = (index: number) => {
		if (index === 0) return "rank0";
		if (index === 1) return "rank1";
		if (index === 2) return "rank2";
		return "";
		}
	

	return (
		<div className="ranking-card" id={`${top3(index)}`}>
			<RankIcon index={index}/>
			<h3>{driver.driver}</h3>
			<h3>{driver.wins}</h3>
			<h3>{driver.items}</h3>
			<h3>{driver.games}</h3>
		</div>
	)
};

export default UserRanking;
