import { IPlayer } from "../../interfaces/IRoom";

export function havePlayerChanged(
	oldPlayer: IPlayer,
	futurePlayer: IPlayer
): boolean {
	const { x, y, velocities: v, rotation, rotationAcceleration } = oldPlayer;
	const {
		x: newX,
		y: newY,
		velocities: newV,
		rotation: newRotation,
		rotationAcceleration: newTurnSpeed,
	} = futurePlayer;

	const somethingChange = x !== newX || y !== newY;
	const velocitiesChanged = v.vx !== newV.vx || v.vy !== newV.vy;
	const rotationChanged = rotation !== newRotation;
	const turnAccelerationChanged = rotationAcceleration !== newTurnSpeed;

	const posAndVelChanged = somethingChange || velocitiesChanged;
	const rotationAndTurnSpeedChanged =
		rotationChanged || turnAccelerationChanged;

	return posAndVelChanged || rotationAndTurnSpeedChanged;
}
