// region Imports
import { TRobotMap } from '../pudu-api/robotMap';
import { TMapWithDestinations } from './map';
import { TRobotStatus } from './robotStatus';
import { TPuduApiRobotStatus } from '../pudu-api/robotStatus';
// endregion

export type TRobotData = {
    map?: TRobotMap;
    maps?: Array<TMapWithDestinations>;
    robotStatus: TRobotStatus;
    puduRobotStatus?: TPuduApiRobotStatus;
};
