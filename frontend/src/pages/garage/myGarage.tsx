import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./myGarage.css";
import BxsHome from "../../components/icons/home";
import Gallery from "../../components/icons/carGallery";
import Btn from "../../components/other/button";
import BxsLock from "../../assets/icons/lock";
import GameIconsHomeGarage from "../../assets/icons/garage";
import GameIconsF1Car from "../../assets/icons/f1";
import { CarsAPI } from "../../api/cars";
import { UserAPI } from "../../api/users";

interface CarsDictionary {
	name: string;
	value: number;
	isLocked: boolean;
}

interface Car {
	id: number;
	name: string;
	unlock_requirement: string;
}
const MyGarage = () => {
	const [inUse, setInUse] = useState(1);
	const [cars, setCars] = useState<CarsDictionary[]>([]);
	const navigate = useNavigate();
	const apiCars = new CarsAPI();
	const userApi = new UserAPI();
	const carsIndex = [
		{ name: "Blue", value: 1, isLocked: false },
		{ name: "Green", value: 2, isLocked: false },
		{ name: "Purple", value: 3, isLocked: false },
		{ name: "Pink", value: 4, isLocked: false },
		{ name: "Cian", value: 5, isLocked: false },
		{ name: "Red", value: 6, isLocked: false },
		{ name: "OrangeBlue", value: 7, isLocked: false },
		{ name: "White", value: 8, isLocked: false },
		{ name: "OrangeNeon", value: 9, isLocked: false },
		{ name: "Jade", value: 10, isLocked: false },
		{ name: "Amethist", value: 11, isLocked: false },
	];
	const home = () => {
		navigate("/home");
	};
	const handleChoosenCar = async (car: CarsDictionary) => {
		if (!car.isLocked) {
			try {
				const response = await userApi.getMyUser();
				if (response.statusCode !== 200) {
					throw new Error(
						"Ocorreu um erro ao buscar dados, tente mais tarde"
					);
				}
				const id = response.data.id;
				const carResponse = await apiCars.selectCar(id, car.value);
				setInUse(car.value);
				console.log(carResponse);
			} catch (error) {
				console.error("Erro ao selecionar o carro: ", error);
			}
		}
	};
	useEffect(() => {
		async function fetchCars() {
			try {
				const responseMyUser = await userApi.getMyUser();
				if (responseMyUser.statusCode !== 200) {
					throw new Error(
						"Ocorreu um erro ao buscar dados, tente mais tarde"
					);
				}
				const id = responseMyUser.data.id;
				const selected_car = responseMyUser.data.selected_car_id;
				setInUse(selected_car);
				const responseCars = await apiCars.getCars(id);
				const unlockedCars = responseCars.data;
				const combinedCars = carsIndex.map((car, index) => {
					const isUnlocked = unlockedCars.some(
						(unlockedCar: Car) => unlockedCar.id === index + 1
					);
					return {
						...car,
						isLocked: !isUnlocked,
					};
				});
				setCars(combinedCars);
			} catch (error) {
				console.error("Erro: ", error);
			}
		}
		fetchCars();
	}, []);
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
					{cars.map((car, index) => (
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
