import React, { useState } from "react";
import InputEmoji from "react-input-emoji";

export default function InputEmojiComponent() {
	const [text, setText] = useState("");

	function handleOnEnter(text: string) {
		console.log("enter", text);
	}

	return (
		<InputEmoji
			value={text}
			onChange={setText}
			cleanOnEnter
			onEnter={handleOnEnter}
			placeholder="Type a message"
			shouldReturn={true}                // Set this based on your needs
			shouldConvertEmojiToImage={false}
			background="none"
			borderColor="rgba(0,0,0,0)"
			color="var(--color-1)"
			borderRadius={0}
		/>
	);
}
