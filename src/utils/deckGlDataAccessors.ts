import { TRobotPose } from '../types/pudu-api/robotPose';
import { radiansToDegrees } from './deckGlHelpers';

type TDeckglPosition = [number, number, number];
type TDeckglOrientation = [number, number, number];
type TDeckglColor = [number, number, number];



export const getRobotPosition = (robotPose: TRobotPose | undefined, z = 0): TDeckglPosition => (
    [robotPose?.x || 0, robotPose?.y || 0, z]
);

export const getRobotColor = (selected: boolean): TDeckglColor => selected
    ? [0, 255, 42]
    : [25,139,44];

export const getRobotOrientation = (angle: number): TDeckglOrientation => [
    0,
    radiansToDegrees(angle) + 90,
    90
];
