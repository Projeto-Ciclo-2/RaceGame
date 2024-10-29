import { config } from "../config/config";

export default function DebugConsole(
	message?: any,
	...optionalParams: any[]
): void {
	if (config.DEBUG_MODE) {
		if (optionalParams && optionalParams.length > 0) {
			return console.log(message, optionalParams);
		}
		console.log(message);
	}
}
