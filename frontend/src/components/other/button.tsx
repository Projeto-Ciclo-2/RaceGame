import React from "react";
import type { SVGProps } from "react";

interface ButtonProps {
	type: "submit" | "button";
	text: string | null;
	id?: string;
	className?: string;
	onClick?: () => void;
	disabled?: boolean;
	icon?: React.ComponentType<SVGProps<SVGSVGElement>>;
	iconPosition?: "left" | "right";
	href?: string;
}

const Btn: React.FC<ButtonProps> = ({
	type,
	text,
	id,
	className,
	onClick,
	disabled = false,
	icon: Icon,
	iconPosition = "left",
	href,
}) => {
	return href ? (
		<a href={href}>
			<button
				type={type}
				id={id}
				className={className}
				onClick={onClick}
				disabled={disabled}
				style={{
					cursor: disabled ? "not-allowed" : "pointer",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{Icon && iconPosition === "left" && (
					<Icon style={{ marginRight: "0.5rem" }} />
				)}
				{text}
				{Icon && iconPosition === "right" && (
					<Icon style={{ marginLeft: "0.5rem" }} />
				)}
			</button>
		</a>
	):(
		<button
				type={type}
				id={id}
				className={className}
				onClick={onClick}
				disabled={disabled}
				style={{
					cursor: disabled ? "not-allowed" : "pointer",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{Icon && iconPosition === "left" && (
					<Icon style={{ marginRight: "0.5rem" }} />
				)}
				{text}
				{Icon && iconPosition === "right" && (
					<Icon style={{ marginLeft: "0.5rem" }} />
				)}
			</button>
	);
};

export default Btn;
