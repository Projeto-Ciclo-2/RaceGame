import React, { ReactNode } from "react";
import { IUser } from "../interfaces/IUser";

interface IUserContextType {
	user: IUser | null;
	setUser: (user: IUser) => void;
}

export const UserContext = React.createContext<IUserContextType | undefined>(
	undefined
);

export default function UserProvider(props: { children: ReactNode }) {
	const [user, setUser] = React.useState<IUser | null>(null);
	return (
		<UserContext.Provider value={{ user, setUser }}>
			{props.children}
		</UserContext.Provider>
	);
}
