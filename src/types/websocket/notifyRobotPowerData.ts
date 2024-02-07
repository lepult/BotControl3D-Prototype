import { TRobotPower } from '../pudu-api/robotPower';

export type TNotifyRobotPowerData = {
    power: number;
    chargeStage: TRobotPower;
};
