import React from "react";
import "./ButtonLobby.css";

interface IButtonLobbyProps {
	content: string;
	type: "ready" | "leave";
}

const ButtonLobby: React.FC<IButtonLobbyProps> = ({ content, type }) => {
	return <button className={type}>{content}</button>;
};

export default ButtonLobby;
