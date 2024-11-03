import React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { EmojiEvents, Logout } from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';
import './SpeedDial.css'

const SpeedDialComponent = () => {
	const actions = [
		{ icon: <Logout />, name: "Logout" },
		{ icon: <EmojiEvents />, name: "Leaderboard" },
	];

	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<SpeedDial
			ariaLabel="SpeedDial controlled open example"
			sx={{ position: "absolute", top: 0, right: 0 }}
			icon={<MenuIcon className="menu-icon"/>}
			onClose={handleClose}
			onOpen={handleOpen}
			open={open}
		>
			{actions.map((action) => (
				<SpeedDialAction
					key={action.name}
					icon={action.icon}
					tooltipTitle={action.name}
					onClick={handleClose}
				/>
			))}
		</SpeedDial>
	);
};

export default SpeedDialComponent;
