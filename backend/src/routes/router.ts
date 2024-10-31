import express, { Express } from "express";
import userRoutes from "./userRoutes";
import freeRoutes from "./freeRoutes";
import isAuthenticated from "../middlewares/AuthMiddlewares";

export const router: Express = express();

router.use("", freeRoutes);
router.use("/users", isAuthenticated, userRoutes);
