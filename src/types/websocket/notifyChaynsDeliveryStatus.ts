import { TRobotStatus } from '../api/robotStatus';

export type TNotifyChaynsDeliveryStatus = {
    chaynsStatus: TRobotStatus;
    manufacturerData: object;
};
