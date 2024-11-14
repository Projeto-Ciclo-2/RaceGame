import "./confirmation.css";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface ConfirmationProps {
	title: string;
	description: string;
	onConfirm: () => void;
	onReject: () => void;
}

export default function Confirmation({
	title,
	description,
	onConfirm,
	onReject,
}: ConfirmationProps) {
	return (
		<div id="confirmation-overlay">
			<div id="confirmation-modal">
				<h2 className="confirmation-title">{title}</h2>
				<p className="confirmation-description">{description}</p>
				<div id="confirmation-buttons">
					<button onClick={onConfirm} className="confirm-button">
						<CheckIcon /> Accept
					</button>
					<button onClick={onReject} className="reject-button">
						<CloseIcon /> Decline
					</button>
				</div>
			</div>
		</div>
	);
}
