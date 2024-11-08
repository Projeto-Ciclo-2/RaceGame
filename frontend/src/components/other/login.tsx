import { useGoogleLogin } from "@react-oauth/google";
import React, { useEffect, useState } from "react";
import GoogleIcon from "../icons/google";
import Btn from "./button";

export const Login = () => {
	const [googleLoginAttempt, setGoogleLoginAttempt] = useState(false);
	const handleGoogleLogin = useGoogleLogin({
		onSuccess: async (response) => {
			try {
				const result = await fetch(
					"https://www.googleapis.com/oauth2/v3/userinfo",
					{
						headers: {
							Authorization: `Bearer ${response.access_token}`,
							Accept: "application/json",
						},
					}
				);

				const data = await result.json();
				console.log(data);
				const apiResponse = await fetch(
					"http://localhost:5000/api/login",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(data),
					}
				);
				console.log(apiResponse);
				if (apiResponse.ok) {
					window.location.href = "/home";
				} else {
					throw new Error(apiResponse.statusText);
				}
			} catch (error) {
				console.log(error);
			}
		},

		onError: (error) => {
			return console.log(error);
		},
	});
	useEffect(() => {
		if (googleLoginAttempt) {
			handleGoogleLogin();
			setGoogleLoginAttempt(false);
		}
	}, [googleLoginAttempt, handleGoogleLogin, setGoogleLoginAttempt]);

	return (
		<>
			<Btn
				type="button"
				text={"Continue with Google"}
				onClick={() => setGoogleLoginAttempt(true)}
				icon={GoogleIcon}
			/>
		</>
	);
};
