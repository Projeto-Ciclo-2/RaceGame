import React from "react";
import { Route, BrowserRouter, Routes as Switch } from "react-router-dom";
import { WebSocketProvider } from "./context/WebSocketContext";
import UserProvider from "./context/UserContext";

const AppRouter = () => {
	return (
		<main>
			<UserProvider>
				<WebSocketProvider>
					<BrowserRouter>
						<Switch></Switch>
					</BrowserRouter>
				</WebSocketProvider>
			</UserProvider>
		</main>
	);
};

export default AppRouter;
