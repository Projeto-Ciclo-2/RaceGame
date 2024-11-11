import { useGoogleLogin } from "@react-oauth/google";
import React, { useContext, useEffect, useState } from "react";
import GoogleIcon from "../icons/google";
import Btn from "./button";
import { UserAPI } from "../../api/users";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

export const Login = () => {
	const [googleLoginAttempt, setGoogleLoginAttempt] = useState(false);

	const userContext = useContext(UserContext);

	const navigate = useNavigate();

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

				const apiResponse = await fetch(
					"http://localhost:5000/api/login",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						credentials: "include",
						body: JSON.stringify(data),
					}
				);

				if (apiResponse.ok) {
					const userApi = new UserAPI();

					const user = await userApi.getMyUser();
					
					if (userContext) {
						userContext.user.current = user.data;
					}

					navigate("/home");
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
