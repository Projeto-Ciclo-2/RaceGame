const prod = true;
const tls = true;
const HOSTNAME = prod ? "alpha06.alphaedtech.org.br/backend" : "localhost";
const port = prod ? "" : ":5000";
const protocol = tls ? "https://" : "http://";
const websocketProtocol = tls ? "wss://" : "ws://";

export const config = {
	SELF: protocol + HOSTNAME + port,
	API_URL: protocol + HOSTNAME + port + "/api",
	WS_URL: websocketProtocol + HOSTNAME + port,
	DEBUG_MODE: false,
};
