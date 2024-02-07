import { TMovementStatus } from '../api/robotStatus';

export type TNotifyRobotMoveStateData = {
    state: TMovementStatus;
    errors?: Array<TMovementError>;
};

export type TMovementError = {
    level: string;
    errorType: string;
    detail: string;
};
