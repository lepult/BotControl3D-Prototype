// region Imports
import { DestinationType } from '../api/destination';
// endregion

export type TPuduApiDestination = {
    // Table number
    name: string;
    type: DestinationType;
};
