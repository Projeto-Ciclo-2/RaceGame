import express, { Express } from "express";
import cookieParser from "cookie-parser";
import { config } from "./config/index";
import { router } from "./routes/router";
import cors from "cors";
import http from "http";
import { wss } from "./websocket/websocket";

import session from "express-session";

const app: Express = express();

app.use(
	cors({
		origin: config.CLIENT_URL,
		credentials: true,
	})
);
app.use(
	session({
		secret: config.GOOGLE_CLIENT_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);

app.use(cookieParser());
app.use(express.json());
app.use("/api", router);

const server = http.createServer(app);
server.listen(config.BACKEND_PORT, () => {
	console.log(`server running at port ${config.BACKEND_PORT}!`);
});

server.on("upgrade", (req, socket, head) => {
	wss.handleUpgrade(req, socket, head, (ws) => {
		wss.emit("connection", ws, req);
	});
});
