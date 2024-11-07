import React from "react";
import { config } from "../config/config";
import DebugConsole from "../log/DebugConsole";
import { UserContext } from "./UserContext";
import {
	WsAllRooms,
	WsBroadcastJoinGame,
	WsBroadcastNewMessage,
	WsBroadcastPlayerMove,
	WsBroadcastPlayerPickItem,
	WsBroadcastPlayerReady,
	WsBroadcastUseItem,
	WsCreateRoom,
	WsEndGame,
	WsGameInit,
	WsGameState,
	WsNewRoom,
	WsPlayerArrives,
	WsPlayerLeft,
	WsPlayerMove,
	WsPlayerPicksItem,
	WsPlayerReady,
	WsPlayerUsesItem,
	WsPostMessage,
	WsPublishItem,
	WsRequestJoinRoom,
	WsRoomInfo,
} from "../interfaces/IWSMessages";

/**
 * WebSocket context interface that defines the structure and behavior of the WebSocket provider.
 */
export interface WebSocketContextType {
	socket: WebSocket | undefined;
	latestMessage: string | null;
	isConnected: React.MutableRefObject<boolean>;
	username: string | undefined;
	onConnectPromise: undefined | Promise<boolean>;

	onReceiveAllRooms: (cbFn: (e: WsAllRooms) => any) => void;
	onReceiveNewRoom: (cbFn: (e: WsNewRoom) => any) => void;
	onReceiveRoomInfo: (cbFn: (e: WsRoomInfo) => any) => void;
	onReceiveJoinGame: (cbFn: (e: WsBroadcastJoinGame) => any) => void;
	onReceivePlayerLeft: (cbFn: (e: WsPlayerLeft) => any) => void;
	onReceiveNewMessage: (cbFn: (e: WsBroadcastNewMessage) => any) => void;
	onReceivePlayerReady: (cbFn: (e: WsBroadcastPlayerReady) => any) => void;
	onReceiveGameInit: (cbFn: (e: WsGameInit) => any) => void;
	onReceivePlayerMove: (cbFn: (e: WsBroadcastPlayerMove) => any) => void;
	onReceivePickItem: (cbFn: (e: WsBroadcastPlayerPickItem) => any) => void;
	onReceiveUseItem: (cbFn: (e: WsBroadcastUseItem) => any) => void;
	onReceivePublishItem: (cbFn: (e: WsPublishItem) => any) => void;
	onReceiveEndGame: (cbFn: (e: WsEndGame) => any) => void;
	onReceiveGameState: (cbFn: (e: WsGameState) => any) => void;

	sendCreateRoom: (obj: WsCreateRoom) => void;
	sendRequestJoinRoom: (obj: WsRequestJoinRoom) => void;
	sendPlayerLeft: (obj: WsPlayerLeft) => void;
	sendMessage: (obj: WsPostMessage) => void;
	sendPlayerReady: (obj: WsPlayerReady) => void;
	sendPlayerMove: (obj: WsPlayerMove) => void;
	sendPlayerPickItem: (obj: WsPlayerPicksItem) => void;
	sendPlayerUsesItem: (obj: WsPlayerUsesItem) => void;
	sendPlayerArrives: (obj: WsPlayerArrives) => void;
}

export const WebSocketContext = React.createContext<
	WebSocketContextType | undefined
>(undefined);

interface WebSocketProviderProps {
	children: React.ReactNode;
}

type serverActions =
	| "allRooms"
	| "newRoom"
	| "roomInfo"
	| "broadcastJoinGame"
	| "broadcastPlayerLeft"
	| "broadcastNewMessage"
	| "broadcastPlayerReady"
	| "gameInit"
	| "broadcastPlayerMove"
	| "broadcastPlayerPickItem"
	| "broadcastUseItem"
	| "publishItem"
	| "endGame"
	| "gameState";

const validActions: serverActions[] = [
	"allRooms",
	"newRoom",
	"roomInfo",
	"broadcastJoinGame",
	"broadcastPlayerLeft",
	"broadcastNewMessage",
	"broadcastPlayerReady",
	"gameInit",
	"broadcastPlayerMove",
	"broadcastPlayerPickItem",
	"broadcastUseItem",
	"publishItem",
	"endGame",
	"gameState",
];

const fnMapping: Record<serverActions, (e: any) => void> = {
	allRooms: (e: WsAllRooms) => {},
	newRoom: (e: WsNewRoom) => {},
	roomInfo: (e: WsRoomInfo) => {},
	broadcastJoinGame: (e: WsBroadcastJoinGame) => {},
	broadcastPlayerLeft: (e: WsPlayerLeft) => {},
	broadcastNewMessage: (e: WsBroadcastNewMessage) => {},
	broadcastPlayerReady: (e: WsBroadcastPlayerReady) => {},
	gameInit: (e: WsGameInit) => {},
	broadcastPlayerMove: (e: WsBroadcastPlayerMove) => {},
	broadcastPlayerPickItem: (e: WsBroadcastPlayerPickItem) => {},
	broadcastUseItem: (e: WsBroadcastUseItem) => {},
	publishItem: (e: WsPublishItem) => {},
	endGame: (e: WsEndGame) => {},
	gameState: (e: WsGameState) => {},
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
	children,
}) => {
	const userContext = React.useContext(UserContext);

	const isConnected = React.useRef(false);
	const canConnect = React.useRef(window.location.pathname === "/game");
	const tryingToConnect = React.useRef(false);
	const timeInterval = React.useRef<NodeJS.Timer | undefined>(undefined);

	const onConnectPromise = React.useRef<undefined | Promise<boolean>>(
		undefined
	);
	const resolvePromise = React.useRef<undefined | (() => void)>(undefined);
	const rejectPromise = React.useRef<undefined | (() => void)>(undefined);

	const [latestMessage, setLatestMessage] = React.useState<string | null>(
		null
	);
	const nameRef = React.useRef<string | undefined>(undefined);

	const socketRef = React.useRef<undefined | WebSocket>(undefined);
	const [socket, setSocket] = React.useState<undefined | WebSocket>(
		undefined
	);
	const connectSocket = React.useCallback(() => {
		DebugConsole("ws memo called");
		if (socketRef.current) return;

		const currentPath = window.location.pathname;
		const pathAuth = currentPath === "/game";
		const allowed = canConnect.current || !isConnected.current;
		// const userCorrect =
		// 	userContext && userContext.user && userContext.user.name;
		const can = true && pathAuth;

		if (!allowed || tryingToConnect.current || !can) {
			DebugConsole("-ws blocked-");
			return;
		}
		DebugConsole("!ws allowed to connect. Trying to connect!");

		tryingToConnect.current = true;

		let username = window.prompt("digite o nome de usuário");
		while (!username) {
			username = window.prompt("insira um nome válido");
		}
		nameRef.current = username;

		const wsURL = config.WS_URL + "?username=" + nameRef.current;
		const tempWS = new WebSocket(wsURL);

		socketRef.current = tempWS;

		setSocket(tempWS);
		onConnectPromise.current = new Promise((res, rej) => {
			resolvePromise.current = () => {
				res(true);
			};
			rejectPromise.current = () => {
				rej();
			};
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		canConnect.current,
		canConnect,
		isConnected.current,
		tryingToConnect.current,
		userContext,
	]);

	if (!timeInterval.current) {
		timeInterval.current = setInterval(() => {
			if (isConnected.current) return;

			const currentPath = window.location.pathname;
			const can = currentPath === "/game";
			canConnect.current = can;
			connectSocket();
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, 1000);
	}

	React.useEffect(() => {
		if (!socket) return;

		socket.onopen = () => {
			tryingToConnect.current = false;
			isConnected.current = true;
			console.log("WebSocket connection established");
			clearInterval(timeInterval.current);
			if (resolvePromise.current) {
				resolvePromise.current();
			}
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
			if (rejectPromise.current) {
				rejectPromise.current();
			}
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
			if (rejectPromise.current) {
				rejectPromise.current();
			}
		};

		return () => {
			DebugConsole("ws effect dismounting context.");
			tryingToConnect.current = false;
			isConnected.current = false;
			socket?.close();
			clearInterval(timeInterval.current);
			timeInterval.current = undefined;
			if (rejectPromise.current) {
				rejectPromise.current();
			}
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
				username: nameRef.current,
				onConnectPromise: onConnectPromise.current,
				// Receiving functions (callbacks for incoming WebSocket messages)
				onReceiveAllRooms: (cbFn) =>
					setCallback<WsAllRooms>("allRooms", cbFn),
				onReceiveNewRoom: (cbFn) =>
					setCallback<WsNewRoom>("newRoom", cbFn),
				onReceiveRoomInfo: (cbFn) =>
					setCallback<WsRoomInfo>("roomInfo", cbFn),
				// room
				onReceiveJoinGame: (cbFn) =>
					setCallback<WsBroadcastJoinGame>("broadcastJoinGame", cbFn),
				onReceivePlayerLeft: (cbFn) =>
					setCallback<WsPlayerLeft>("broadcastPlayerLeft", cbFn),
				onReceiveNewMessage: (cbFn) =>
					setCallback<WsBroadcastNewMessage>(
						"broadcastNewMessage",
						cbFn
					),
				onReceivePlayerReady: (cbFn) =>
					setCallback<WsBroadcastPlayerReady>(
						"broadcastPlayerReady",
						cbFn
					),
				//in-game
				onReceiveGameInit: (cbFn) =>
					setCallback<WsGameInit>("gameInit", cbFn),
				onReceivePlayerMove: (cbFn) =>
					setCallback<WsBroadcastPlayerMove>(
						"broadcastPlayerMove",
						cbFn
					),
				onReceivePickItem: (cbFn) =>
					setCallback<WsBroadcastPlayerPickItem>(
						"broadcastPlayerPickItem",
						cbFn
					),
				onReceiveUseItem: (cbFn) =>
					setCallback<WsBroadcastUseItem>("broadcastUseItem", cbFn),
				onReceivePublishItem: (cbFn) =>
					setCallback<WsPublishItem>("publishItem", cbFn),
				onReceiveEndGame: (cbFn) =>
					setCallback<WsEndGame>("endGame", cbFn),
				onReceiveGameState: (cbFn) =>
					setCallback<WsGameState>("gameState", cbFn),

				// Sending functions (functions to send outgoing WebSocket messages)
				sendCreateRoom: (obj) => sendMessage(JSON.stringify(obj)),
				sendRequestJoinRoom: (obj) => sendMessage(JSON.stringify(obj)),
				//room
				sendPlayerLeft: (obj) => sendMessage(JSON.stringify(obj)),
				sendMessage: (obj) => sendMessage(JSON.stringify(obj)),
				sendPlayerReady: (obj) => sendMessage(JSON.stringify(obj)),
				//in-game
				sendPlayerMove: (obj) => sendMessage(JSON.stringify(obj)),
				sendPlayerPickItem: (obj) => sendMessage(JSON.stringify(obj)),
				sendPlayerUsesItem: (obj) => sendMessage(JSON.stringify(obj)),
				sendPlayerArrives: (obj) => sendMessage(JSON.stringify(obj)),
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
