// region Imports
import { TRobotPower } from './robotPower';
import { TMovementStatus } from '../api/robotStatus';
import { TRobotState } from './robotState';
import { TRobotPose } from './robotPose';
// endregion

export type TPuduApiRobotStatus = {
    // Battery status
    chargeStage?: TRobotPower;
    // The movement status of the robot
    moveState?: TMovementStatus;
    robotState?: TRobotState;
    robotPose?: TRobotPose;
    // Battery power
    robotPower?: number;
};
