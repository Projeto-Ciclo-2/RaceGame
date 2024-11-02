import React from "react";
import { Route, BrowserRouter, Routes as Switch } from "react-router-dom";
import { WebSocketProvider } from "./context/WebSocketContext";
import UserProvider from "./context/UserContext";
import Game from "./pages/game/Game";
import { Login } from "./pages/login";
import LandingPage from "./pages/landingpage/landingpage";

const AppRouter = () => {
	return (
		<main>
			<UserProvider>
				<WebSocketProvider>
					<BrowserRouter>
						<Switch>
							<Route element={<Login />} path="/login" />
							<Route element={<LandingPage />} path="/" />
							<Route element={<Game />} path="/game" />
						</Switch>
					</BrowserRouter>
				</WebSocketProvider>
			</UserProvider>
		</main>
	);
};

export default AppRouter;
