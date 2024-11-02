import React from "react";
import { Route, BrowserRouter, Routes as Switch } from "react-router-dom";
import { WebSocketProvider } from "./context/WebSocketContext";
import UserProvider from "./context/UserContext";
import Game from "./pages/game/Game";
import Homepage from "./pages/homepage/Homepage";

const AppRouter = () => {
	return (
		<main>
			<UserProvider>
				<WebSocketProvider>
					<BrowserRouter>
						<Switch>
							<Route element={<Game />} path="/game" />
							<Route element={<Homepage />} path="/home" />
						</Switch>
					</BrowserRouter>
				</WebSocketProvider>
			</UserProvider>
		</main>
	);
};

export default AppRouter;
