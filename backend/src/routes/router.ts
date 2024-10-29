import express, { Express } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import AuthMiddleware from "../middlewares/AuthMiddlewares";

export const router: Express = express();

router.use("", authRoutes);
router.use(AuthMiddleware);
router.use("/users", userRoutes);
