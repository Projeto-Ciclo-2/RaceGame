import React from "react";
import "./Lobby.css";
import InputEmojiComponent from "../../components/InputEmoji/InputEmoji";
import { useNavigate } from "react-router-dom";
import Btn from "../../components/other/button";

const Lobby = () => {
	const messages = ["Player1 entered", "the race!"];
	const navigate = useNavigate()

	return (
		<section id="lobby">
			<section id="content-lobby">
				<div id="content-game">
					<div id="status-game">
						<p>
							Players: <span>1 / 4</span>
						</p>
						<p>
							Players Ready: <span>0 / 1</span>
						</p>
					</div>
					<p className="alert-game-init">The game will start as soon as everyone is ready 🏁</p>
					<div id="image-lobby"></div>
					<div id="last-div">
						<hr />
						<div>
							<Btn type="button" text="I'm ready" id="ready" onClick={() => navigate("/loading")}/>
							<Btn type="button" text="Leave the game" id="leave" onClick={() => navigate("/home")}/> 
						</div>
					</div>
				</div>
				<div id="chat-lobby">
					<div id="chat">
						{messages.map((message, index) => (
							<p key={index}> <span className="name-user">name</span> {message}</p>
						))}
					</div>
					<hr />
					<div id="div-input">
						<InputEmojiComponent />
					</div>
				</div>
			</section>
		</section>
	);
};

export default Lobby;
