import { Router } from "express";

import CarController from "../controllers/carController";

const carController: CarController = new CarController();
const carRoutes: Router = Router();

carRoutes.get("/:userId", carController.getCars.bind(carController));

carRoutes.put("/user_car", carController.selectUserCar.bind(carController));

export default carRoutes;
