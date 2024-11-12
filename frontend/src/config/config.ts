const prod = false;
const tls = false;
const HOSTNAME = prod ? "alpha06.alphaedtech.org.br/backend" : "localhost";
const port = prod ? "" : ":5000";
const protocol = tls ? "https://" : "http://";
const websocketProtocol = tls ? "wss://" : "ws://";

export const config = {
	API_URL: protocol + HOSTNAME + port + "/api",
	WS_URL: websocketProtocol + HOSTNAME + port,
	DEBUG_MODE: false,
};
