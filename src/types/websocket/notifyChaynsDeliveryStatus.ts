// region Imports
import { TRobotStatus } from '../api/robotStatus';
// endregion

export type TNotifyChaynsDeliveryStatus = {
    chaynsStatus: TRobotStatus;
    manufacturerData: object;
};
