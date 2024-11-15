import React from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { EmojiEvents, Logout, Garage } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import "./SpeedDial.css";
import { useNavigate } from "react-router-dom";
import { UserAPI } from "../../api/users";

const SpeedDialComponent = () => {
	const userAPI = new UserAPI();
	const actions = [
		{ icon: <Logout />, name: "Logout", navigate: "/" },
		{
			icon: <EmojiEvents />,
			name: "Leaderboard",
			navigate: "/leaderboard",
		},
		{ icon: <Garage />, name: "My Garage", navigate: "/garage"}
	];

	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const navigate = useNavigate();
	return (
		<SpeedDial
			ariaLabel="SpeedDial controlled open example"
			sx={{ position: "absolute", top: 0, right: 0 }}
			icon={<MenuIcon className="menu-icon" />}
			onClose={handleClose}
			onOpen={handleOpen}
			open={open}
		>
			{actions.map((action) => (
				<SpeedDialAction
					key={action.name}
					icon={action.icon}
					tooltipTitle={action.name}
					onClick={() => {
						handleClose();
						if (action.name === "Logout") {
							userAPI.logout().then(() => {
								navigate(action.navigate);
							});
						} else {
							navigate(action.navigate);
						}
					}}
				/>
			))}
		</SpeedDial>
	);
};

export default SpeedDialComponent;
