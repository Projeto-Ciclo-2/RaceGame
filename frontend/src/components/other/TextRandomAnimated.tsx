import React from "react";

export default function TextRandomAnimated(props: {
	text: string;
	speed: number;
}) {
	const [displayedText, setDisplayedText] = React.useState(props.text);
	const [index, setIndex] = React.useState(0);
	React.useEffect(() => {
		const timeIntervalID = setInterval(() => {
			const randomIndex = Math.floor(Math.random() * props.text.length);
			const symbols = ["3", "&", "=", "§", "4", "*", "$", "Z"];
			const symbolIndex = Math.floor(Math.random() * symbols.length);

			const tempText = props.text;
			const letterInPos = tempText[randomIndex];
			const newText = tempText.replace(letterInPos, symbols[symbolIndex]);

			setDisplayedText(newText);
		}, props.speed);
		return () => clearInterval(timeIntervalID);
	}, [displayedText]);
	return <div>{displayedText}</div>;
}
