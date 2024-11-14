export function calcPercentage(
	myCheckPoints: number,
	doneLaps: number,
	totalLaps: number
) {
	let percentage = {
		totalCheckpoints: 0,
		totalDone: 0 + myCheckPoints,
	};
	for (let index = 0; index < totalLaps; index++) {
		percentage.totalCheckpoints += 5;
	}
	console.log(myCheckPoints, doneLaps, totalLaps);
	if (doneLaps >= totalLaps) {
		percentage.totalDone += 5 * totalLaps;
	} else {
		for (let index = 0; index < totalLaps; index++) {
			if (doneLaps > index) {
				percentage.totalDone += 5;
			}
		}
	}
	return (percentage.totalDone / percentage.totalCheckpoints) * 100;
}
