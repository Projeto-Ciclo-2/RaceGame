import React from "react";
import { config } from "../config/config";
import DebugConsole from "../log/DebugConsole";
import { UserContext } from "./UserContext";

/**
 * WebSocket context interface that defines the structure and behavior of the WebSocket provider.
 */
interface WebSocketContextType {
	socket: WebSocket | undefined;
	latestMessage: string | null;
	isConnected: React.MutableRefObject<boolean>;
}

const WebSocketContext = React.createContext<WebSocketContextType | undefined>(
	undefined
);

interface WebSocketProviderProps {
	children: React.ReactNode;
}

type serverActions = "allPolls";
const validActions: serverActions[] = ["allPolls"];
const fnMapping: Record<serverActions, (e: any) => void> = {
	allPolls: (e: IWSMessagePolls) => {},
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
	children,
}) => {
	const userContext = React.useContext(UserContext);

	const isConnected = React.useRef(false);
	const [canConnect, setCanConnect] = React.useState(false);
	const tryingToConnect = React.useRef(false);
	const timeInterval = React.useRef<NodeJS.Timer | undefined>(undefined);

	const [latestMessage, setLatestMessage] = React.useState<string | null>(
		null
	);

	const socketRef = React.useRef<undefined | WebSocket>(undefined);
	const socket = React.useMemo<undefined | WebSocket>(() => {
		DebugConsole("ws memo called");
		if (socketRef.current) return socketRef.current as WebSocket;

		const currentPath = window.location.pathname;
		const pathAuth = currentPath === "/home";
		const allowed = canConnect || !isConnected.current;
		const userCorrect =
			userContext && userContext.user && userContext.user.name;
		const can = userCorrect && pathAuth;

		if (!allowed || tryingToConnect.current || !can) {
			DebugConsole("-ws blocked-");
			return undefined;
		}
		DebugConsole("!ws allowed to connect. Trying to connect!");

		tryingToConnect.current = true;

		const wsURL = config.WS_URL + "?username=" + userContext.user!.name;
		const tempWS = new WebSocket(wsURL);

		socketRef.current = tempWS;
		return tempWS;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [canConnect, isConnected.current, tryingToConnect.current, userContext]);

	if (!timeInterval.current) {
		timeInterval.current = setInterval(() => {
			if (isConnected.current) return;

			const currentPath = window.location.pathname;
			setCanConnect(currentPath === "/home");
			DebugConsole("is not connected, canConnect: " + canConnect);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, 1000);
	}

	React.useEffect(() => {
		if (!socket) return;

		socket.onopen = () => {
			tryingToConnect.current = false;
			isConnected.current = true;
			DebugConsole("WebSocket connection established");
		};

		socket.onmessage = (event: MessageEvent) => {
			setLatestMessage(event.data);
			DebugConsole("ws receive a message");
			if (event.data) {
				const data = JSON.parse(event.data);
				const type = data.type;
				const valid = data && type;
				const typeValid =
					typeof data === "object" && typeof type === "string";
				if (valid && typeValid) {
					let isValidAction = false;
					for (const action of validActions) {
						if (action === type) isValidAction = true;
					}
					if (isValidAction) {
						DebugConsole(
							"ws calling callback function '" + type + "'."
						);

						return fnMapping[type as serverActions](data);
					}
					return console.error(
						"ws received a not valid type: '" + type + "'."
					);
				}
				DebugConsole("ws received a not valid data.", data);
			}
			DebugConsole(event.data);
		};

		socket.onclose = (e) => {
			tryingToConnect.current = false;
			isConnected.current = false;
			DebugConsole("WebSocket connection closed");
			if (e.code === 1000) {
				alert(
					"Usuário já está logado em nossa plataforma através de outro navegador."
				);
			}
			DebugConsole(e);
		};

		socket.onerror = (error) => {
			tryingToConnect.current = false;
			isConnected.current = false;
			console.error("WebSocket error:", error);
		};

		return () => {
			DebugConsole("ws effect dismounting context.");
			tryingToConnect.current = false;
			isConnected.current = false;
			socket.close();
			clearInterval(timeInterval.current);
			timeInterval.current = undefined;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	const sendMessage = (message: string) => {
		if (socket?.readyState === WebSocket.OPEN) {
			DebugConsole("ws sending message to backend");
			socket.send(message);
		} else {
			console.error("WebSocket is not open");
		}
	};

	const setCallback = <T,>(
		action: serverActions,
		cbFn: (e: T) => void
	): any => {
		fnMapping[action] = cbFn;
	};

	return (
		<WebSocketContext.Provider
			value={{
				socket: socket,
				latestMessage,
				isConnected,
			}}
		>
			{children}
		</WebSocketContext.Provider>
	);
};

export const useWebSocket = (): WebSocketContextType => {
	const context = React.useContext(WebSocketContext);
	if (!context) {
		throw new Error("useWebSocket must be used within a WebSocketProvider");
	}
	return context;
};
