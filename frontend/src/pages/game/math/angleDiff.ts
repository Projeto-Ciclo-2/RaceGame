export function minAngleDiff(angle1: number, angle2: number) {
	let diff = ((angle1 - angle2 + Math.PI) % (2 * Math.PI)) - Math.PI;
	return Math.abs(diff);
}
