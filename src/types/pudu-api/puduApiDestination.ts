import { DestinationType } from '../api/destination';

export type TPuduApiDestination = {
    // Table number
    name: string;
    type: DestinationType;
};
