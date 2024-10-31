import express, { Router } from "express";
import UserController from "../controllers/userController";
import passport from "passport";
import GoogleAuth from "../services/GoogleAuthService";

const userController: UserController = new UserController();
const freeRouter: Router = express.Router();
new GoogleAuth();

freeRouter.get("/teste", (req, res) => {
	res.send("Teste");
});

export default freeRouter;
