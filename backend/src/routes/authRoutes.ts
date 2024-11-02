import express, { Router } from "express";
import AuthController from "../controllers/authController";

const authController: AuthController = new AuthController();

const authRouter: Router = express.Router();

authRouter.post("/login", authController.login.bind(authController));
authRouter.delete("/logout", authController.logout.bind(authController));

export default authRouter;
