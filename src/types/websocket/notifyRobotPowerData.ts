// region Imports
import { TRobotPower } from '../pudu-api/robotPower';
// endregion

export type TNotifyRobotPowerData = {
    power: number;
    chargeStage: TRobotPower;
};
