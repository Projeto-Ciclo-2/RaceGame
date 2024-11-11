import React, { useContext, useState } from "react";
import InputEmoji from "react-input-emoji";
import { useWebSocket } from "../../context/WebSocketContext";
import { WsPostMessage } from "../../interfaces/IWSMessages";
import { useRoom } from "../../context/RoomContext";
import { UserContext } from "../../context/UserContext";

export default function InputEmojiComponent() {
	const [text, setText] = useState("");

	const userContext = useContext(UserContext);

	const RoomContext = useRoom();

	const WebsocketContext = useWebSocket();

	function handleOnEnter(text: string) {
		const message: WsPostMessage = {
			type: "postMessage",
			message: {
				content: text,
				username: userContext?.user?.current?.username as string,
				userID: userContext?.user?.current?.id as string,
				typeMessageChat: "message",
			},
			roomID: RoomContext.currentRoom?.id as string,
		};
		WebsocketContext.sendMessage(message);
	}

	return (
		<InputEmoji
			value={text}
			onChange={setText}
			cleanOnEnter
			onEnter={() => handleOnEnter(text)}
			placeholder="Type a message"
			shouldReturn={true} // Set this based on your needs
			shouldConvertEmojiToImage={false}
			background="none"
			borderColor="rgba(0,0,0,0)"
			color="var(--color-1)"
			borderRadius={0}
		/>
	);
}
