import express, { Express } from "express";
import cookieParser from "cookie-parser";
import { config } from "./config/index";
import { router } from "./routes/router";
import cors from "cors";
import http from "http";
import { wss } from "./websocket/websocket";
import GoogleAuth from "./services/GoogleAuthService";
import session from "express-session";
import passport from "passport";

const app: Express = express();
new GoogleAuth();
app.use(
	session({
		secret: process.env.GOOGLE_CLIENT_SECRET!,
		resave: false,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
		origin: config.CLIENT_URL,
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.json());
app.use("/api", router);
app.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/" }),
	(req, res) => {
		// Autenticação bem-sucedida, redirecione para a página principal.
		res.redirect("/");
	}
);

const server = http.createServer(app);
server.listen(config.BACKEND_PORT, () => {
	console.log(`server running at port ${config.BACKEND_PORT}!`);
});

server.on("upgrade", (req, socket, head) => {
	wss.handleUpgrade(req, socket, head, (ws) => {
		wss.emit("connection", ws, req);
	});
});
