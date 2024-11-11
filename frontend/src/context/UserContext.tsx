import React, { ReactNode } from "react";
import { IUser } from "../interfaces/IUser";

interface IUserContextType {
	user: React.MutableRefObject<IUser | null>;
}

export const UserContext = React.createContext<IUserContextType | undefined>(
	undefined
);

export default function UserProvider(props: { children: ReactNode }) {
	const user = React.useRef<IUser | null>(null);

	return (
		<UserContext.Provider value={{ user }}>
			{props.children}
		</UserContext.Provider>
	);
}
