import { TGoState } from '../api/robotStatus';
import { TPuduApiDestination } from '../pudu-api/puduApiDestination';

export type TNotifyGoStateData = {
    robotGoState: TGoState;
    destination: TPuduApiDestination;
};
