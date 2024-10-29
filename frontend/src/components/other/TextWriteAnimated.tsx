import React from "react";

export default function TextWriteAnimated(props: {
	text: string;
	speed: number;
	useBar: boolean;
}) {
	const [displayedText, setDisplayedText] = React.useState("");
	const [index, setIndex] = React.useState(0);
	const [reverse, setReverse] = React.useState(false);

	React.useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (reverse) {
				if (index === -1) {
					setReverse(false);
					setIndex((prev) => prev + 1);
					return;
				}

				setDisplayedText(displayedText.slice(0, index));
				setIndex((prev) => prev - 1);
				return;
			}
			if (index === props.text.length) {
				setReverse(true);
				setIndex((prev) => prev - 1);
				return;
			}
			setDisplayedText((prev) => prev + props.text[index]);
			setIndex((prev) => prev + 1);
		}, props.speed);

		return () => clearTimeout(timeoutId);
	}, [index, props.text, props.speed]);

	return (
		<div>
			{displayedText}
			{props.useBar && "|"}
		</div>
	);
}
