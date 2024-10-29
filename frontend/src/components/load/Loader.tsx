import React from "react";
import "./loader.css"; // Importing the CSS for styling

interface ILoader {
	alive: boolean;
}
const Loader: React.FC<ILoader> = (props: { alive: boolean }) => {
	if (!props.alive) return <></>;
	return (
		<div className="loader-container">
			<div className="spinner"></div>
		</div>
	);
};

export default Loader;
