import styled from "@emotion/styled";
import React from "react";

const ColoredBkgParagraph = styled.span`
	padding: 3px 0 3px 7px;
	color: white;
	background-color: purple;
`;
const ColoredParagraph = styled.span`
	padding: 3px 3px 3px 0;
	color: purple;
`;

export default function ColorTextAnimated(props: {
	text: string;
	speed: number;
}) {
	const [displayedText, setDisplayedText] = React.useState("");
	const [displayedText2, setDisplayedText2] = React.useState(props.text);
	const [index, setIndex] = React.useState(0);
	const [reverse, setReverse] = React.useState(false);

	React.useEffect(() => {
		const timeIntervalID = setInterval(() => {
			if (!reverse) {
				if (index > props.text.length) {
					setReverse(true);
					setIndex((prev) => prev - 1);
				} else {
					setDisplayedText(props.text.slice(0, index));
					setDisplayedText2(props.text.slice(index));
					setIndex((prev) => prev + 1);
				}
			} else {
				if (index < 0) {
					setReverse(false);
					setIndex((prev) => prev + 1);
				} else {
					setDisplayedText(props.text.slice(0, index));
					setDisplayedText2(props.text.slice(index));
					setIndex((prev) => prev - 1);
				}
			}
		}, props.speed);
		return () => clearInterval(timeIntervalID);
	}, [index, reverse, props.text, props.speed]);
	return (
		<div>
			<ColoredBkgParagraph>{displayedText}</ColoredBkgParagraph>
			<ColoredParagraph>{displayedText2}</ColoredParagraph>
		</div>
	);
}
