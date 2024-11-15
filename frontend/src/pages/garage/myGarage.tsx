import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./myGarage.css";
import BxsHome from "../../components/icons/home";
import Gallery from "../../components/icons/carGallery";
import Btn from "../../components/other/button";
import BxsLock from "../../assets/icons/lock";
import GameIconsHomeGarage from "../../assets/icons/garage";
import GameIconsF1Car from "../../assets/icons/f1";

interface Car {
	name: string;
	value: number;
	isLocked: boolean;
}
const MyGarage = () => {
	const [inUse, setInUse] = useState(0);
	const navigate = useNavigate();

	const carsIndex = [
		{
			name: "Blue",
			value: 0,
			isLocked: false,
		},
		{ name: "Green", value: 1, isLocked: false },
		{ name: "Purple", value: 2, isLocked: false },
		{ name: "Pink", value: 3, isLocked: false },
		{ name: "Cian", value: 4, isLocked: false },
		{ name: "Red", value: 5, isLocked: true },
		{ name: "OrangeBlue", value: 6, isLocked: true },
		{ name: "White", value: 7, isLocked: true },
		{ name: "OrangeNeon", value: 8, isLocked: true },
		{ name: "Jade", value: 9, isLocked: true },
		{ name: "Amethist", value: 10, isLocked: true },
	];
	const home = () => {
		navigate("/home");
	};
	const handleChoosenCar = (car: Car) => {
		if (!car.isLocked) {
			setInUse(car.value);
		}
	};
	return (
		<div id="garage-content">
			<div id="garage-header">
				<div id="back-home" onClick={home}>
					<BxsHome />
				</div>
				<div id="garage-header-logo">
					<GameIconsHomeGarage />
					<h1> My Garage </h1> <GameIconsF1Car />
				</div>
			</div>
			<div id="garage-body">
				<div id="big-image"></div>
				<div id="cars-container">
					{carsIndex.map((car, index) => (
						<div className="car" key={index}>
							<Gallery index={index} />
							{inUse === car.value && (
								<div className="inUse">
									<h3>In Use...</h3>
								</div>
							)}
							{car.isLocked && (
								<div className="locked">
									<BxsLock />
								</div>
							)}
							<div id="garage-buttons">
								<Btn
									type="button"
									text={"Choose"}
									id="choose-btn"
									onClick={() => handleChoosenCar(car)}
									disabled={
										car.isLocked || inUse === car.value
									}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
export default MyGarage;
