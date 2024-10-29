import React from "react";
import "./notification.css";

interface NotificationProps {
	message: string;
	onClose: () => void;
}
const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
	return (
		<div className="notification">
			<p>{message}</p>
			<button onClick={onClose}>&times;</button>
		</div>
	);
};

export default Notification;
