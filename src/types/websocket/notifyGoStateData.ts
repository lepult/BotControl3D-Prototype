// region Imports
import { TGoState } from '../api/robotStatus';
import { TPuduApiDestination } from '../pudu-api/puduApiDestination';
// endregion

export type TNotifyGoStateData = {
    robotGoState: TGoState;
    destination: TPuduApiDestination;
};
