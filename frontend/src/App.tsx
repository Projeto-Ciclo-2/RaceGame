import React from "react";
import AppRouter from "./routes";
import "./App.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
	return (
		<GoogleOAuthProvider
			clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}
		>
			<AppRouter />
		</GoogleOAuthProvider>
	);
}

export default App;
