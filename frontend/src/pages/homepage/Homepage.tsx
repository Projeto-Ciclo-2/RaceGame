import React, { useContext, useEffect } from "react";
import SpeedDialComponent from "../../components/speed-dial/SpeedDial";
import "./Homepage.css";
import RoomList from "../../components/roomList/RoomList";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { UserAPI } from "../../api/users";
import { useRoom } from "../../context/RoomContext";

const Homepage = () => {
	const userContext = useContext(UserContext);
	const roomContext = useRoom();

	const navigate = useNavigate();

	function createRace() {
		navigate("/loading");
	}

	useEffect(() => {
		async function fetchUser() {
			try {
				const userApi = new UserAPI();
				const result = await userApi.getMyUser();
				console.log(result);

				if (userContext) {
					if (!userContext.user.current) {
						userContext.user.current = result.data;
					}
				}

				if (result.statusCode !== 200) {
					navigate("/");
				}
			} catch (error) {
				navigate("/");
				console.log(error);
			}
		}

		fetchUser();

		// Usuário já está participando de um jogo?
		if (roomContext.playerInRoom) {
			navigate("/game");
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<section id="homepage">
			<section id="content-homepage">
				<SpeedDialComponent />
				<div id="content-title">
					<h2>It’s Racing Time!</h2>
					<p>Grab your helmet and fast your seatbelt!</p>
				</div>
				<div id="content-rooms">
					<RoomList />
					<button onClick={createRace}>Create Race</button>
				</div>
			</section>
		</section>
	);
};

export default Homepage;
