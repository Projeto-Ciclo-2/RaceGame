// const twoPI = Math.PI * 2;

import { degreesToRadians, radiansToDegree } from "./angleConversion";

export const naturalToGameAngle = (angle: number) => {
	let resultDegree = radiansToDegree(angle);
	if (resultDegree < 0) {
		resultDegree += 360;
	}
	if (resultDegree >= 360) {
		resultDegree -= 360;
	}
	const negativeXAngle = 180 - resultDegree;
	return degreesToRadians(
		negativeXAngle >= 0 ? negativeXAngle : negativeXAngle + 360
	);
};
