import React from "react";
import { Route, BrowserRouter, Routes as Switch } from "react-router-dom";
import { WebSocketProvider } from "./context/WebSocketContext";
import UserProvider from "./context/UserContext";
import Game from "./pages/game/Game";
import { Login } from "./components/other/login";
import LandingPage from "./pages/landingpage/landingpage";
import Homepage from "./pages/homepage/Homepage";
import Lobby from "./pages/lobby/Lobby";
import LeaderBoard from "./pages/leaderboard/leaderboard";
import Loading from "./pages/loading/loading";
import { RoomProvider } from "./context/RoomContext";
import MyGarage from "./pages/garage/myGarage";

const AppRouter = () => {
	return (
		<main>
			<UserProvider>
				<WebSocketProvider>
					<RoomProvider>
						<BrowserRouter>
							<Switch>
								<Route element={<Login />} path="/login" />
								<Route element={<LandingPage />} path="/" />
								<Route element={<Game />} path="/game" />
								<Route element={<Homepage />} path="/home" />
								<Route element={<Lobby />} path="/lobby" />
								<Route element={<Loading />} path="/loading" />
								<Route
									element={<LeaderBoard />}
									path="/leaderboard"
								/>
								<Route element={<MyGarage/>} path="/garage"/>
							</Switch>
						</BrowserRouter>
					</RoomProvider>
				</WebSocketProvider>
			</UserProvider>
		</main>
	);
};

export default AppRouter;
