import React from "react";
import { Route, BrowserRouter, Routes as Switch } from "react-router-dom";
import { WebSocketProvider } from "./context/WebSocketContext";
import UserProvider from "./context/UserContext";
import Game from "./pages/game/Game";
import LandingPage from "./pages/landingpage/landingpage";
import LeaderBoard from "./pages/leaderboard/leaderboard";

const AppRouter = () => {
	return (
		<main>
			<UserProvider>
				<WebSocketProvider>
					<BrowserRouter>
						<Switch>
							<Route element={<LandingPage/>} path="/" />
							<Route element={<Game />} path="/game" />
							<Route element={<LeaderBoard/>} path="/leaderboard" />
						</Switch>
					</BrowserRouter>
				</WebSocketProvider>
			</UserProvider>
		</main>
	);
};

export default AppRouter;
