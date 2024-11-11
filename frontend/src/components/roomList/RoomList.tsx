import React, { useContext, useEffect } from "react";
import { useRoom } from "../../context/RoomContext";
import Helmet from "../../assets/icons/Helmet";
import "./RoomList.css";
import { IRoom } from "../../interfaces/IRoom";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../../context/WebSocketContext";
import { WsRequestJoinRoom } from "../../interfaces/IWSMessages";
import { UserContext } from "../../context/UserContext";

const RoomList = () => {
	const userContext = useContext(UserContext);
	const RoomsContext = useRoom();
	const WebsocketContext = useWebSocket();

	const navigate = useNavigate();

	function joinRoom(room: IRoom) {
		RoomsContext.updateRoomLobby(room);

		const message: WsRequestJoinRoom = {
			type: "requestJoinRoom",
			roomID: room.id,
			userID: userContext?.user?.current?.id as string,
		};

		WebsocketContext.sendRequestJoinRoom(message);

		// Navegar para página de lobby
		navigate("/lobby");
	}

	useEffect(() => {
		console.log('effect rooomList');

	}, [WebsocketContext, RoomsContext.rooms])

	return (
		<div id="room-list">
			<ul id="head-list">
				<li>id</li>
				<li>status</li>
				<li>players</li>
				<li>laps</li>
				<li className="button-space"></li>
			</ul>
			<ul id="body-list">
				{RoomsContext.rooms.map((room, index) => (
					<li key={index} className={room.gameInit ? 'room-game-init' : 'room-waiting'}>
						<p className="room-id">{room.id}</p>
						{room.gameInit ? (
							<p>racing</p>
						) : (
							<p className="waiting">waiting</p>
						)}
						<p>{`${room.players.length}/10`}</p>
						<p>{room.laps}</p>
						{room.gameInit ? (
							<div className="center-helmet">
								<Helmet />
							</div>
						) : (
							<button onClick={() => joinRoom(room)} className="button-join">join</button>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

export default RoomList;
