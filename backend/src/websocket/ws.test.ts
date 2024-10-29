// connecting
const socket = new WebSocket("ws://localhost:5000");
socket.onopen = (e) => {
	console.log("Connection opened", e);
};
socket.onmessage = (e) => {
	console.log("Message received", e.data);
};
socket.onclose = (e) => {
	console.log("Connection closed", e);
};
socket.onerror = (e) => {
	console.log("Error occurred", e);
};

// configs
const userID = "f0bae11f-64b2-470c-9534-2660a3737652";
//const userID = "847e9612-9827-4c15-a66b-e8f5d21a919f";
//const userID = "feecdbfe-38b0-47f6-992f-58e5818aee5e";
