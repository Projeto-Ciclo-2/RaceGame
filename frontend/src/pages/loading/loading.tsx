import React, { useContext, useEffect } from "react";
import "./loading.css";
import Animation from "../../components/svg/animation";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { WsCreateRoom } from "../../interfaces/IWSMessages";
import { useWebSocket } from "../../context/WebSocketContext";
import { useRoom } from "../../context/RoomContext";

const Loading = () => {
	const userContext = useContext(UserContext);
	const WebsocketContext = useWebSocket();
	const RoomContext = useRoom();

	const navigate = useNavigate();

	useEffect(() => {
		const message: WsCreateRoom = {
			type: "createRoom",
			userID: userContext?.user?.current?.id as string,
		};
		WebsocketContext.sendCreateRoom(message);

		const timer = setTimeout(() => {
			navigate("/lobby");
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div id="loadpage">
			<h3>ALL</h3>
			<h1>ABOUT RACING</h1>
			<div id="animation">
				<Animation />
			</div>
			<div id="load-content">
				<h4>Wait for a bit while we prepare your car...</h4>
			</div>
		</div>
	);
};

export default Loading;
