import express, { Router } from "express";
import AuthController from "../controllers/authController";

import UserController from "../controllers/userController";

const authController: AuthController = new AuthController();
const userController: UserController = new UserController();

const authRouter: Router = express.Router();

authRouter.post("/login", authController.login.bind(authController));
authRouter.delete("/logout", authController.logout.bind(authController));
authRouter.post("/users", userController.createUser.bind(userController));

export default authRouter;
