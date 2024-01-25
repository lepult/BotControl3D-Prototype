import { TRobotPose } from '../types/pudu-api/robotPose';

type TDeckglPosition = [number, number, number];
type TDeckglOrientation = [number, number, number];
type TDeckglColor = [number, number, number];

const radiansToDegrees = (radians: number) => {
    const pi = Math.PI;
    return radians * (180/pi);
}

export const getRobotPosition = (robotPose: TRobotPose | undefined, z = 0): TDeckglPosition => (
    [robotPose?.x || 0, robotPose?.y || 0, z]
);

export const getRobotColor = (selected: boolean): TDeckglColor => selected
    ? [0, 157, 0]
    : [157, 0, 0];

export const getRobotOrientation = (angle: number): TDeckglOrientation => [
    0,
    radiansToDegrees(angle) + 90,
    90
];
