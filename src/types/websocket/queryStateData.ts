// region Imports
import { TMovementStatus } from '../api/robotStatus';
import { TRobotPower } from '../pudu-api/robotPower';
import { TRobotState } from '../pudu-api/robotState';
import { TRobotPose } from '../pudu-api/robotPose';
// endregion

export type TQueryStateData = {
    robotId: string;
    chargeStage: TRobotPower;
    moveState: TMovementStatus;
    robotState: TRobotState;
    robotPose: TRobotPose;
    robotPower: number;
};
