import express, { Express } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import AuthMiddleware from "../middlewares/AuthMiddlewares";
import carRoutes from "./carRoutes";

export const router: Express = express();

router.use("", authRoutes);
router.use("/cars", carRoutes);
router.use(AuthMiddleware);

router.use("/users", userRoutes);
