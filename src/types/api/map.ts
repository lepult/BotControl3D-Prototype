import { TDestination } from './destination';
import { Hidden } from './hidden';

export type TMapWithDestinations = {
    id: number;
    name: string;
    showName?: string;
    hidden?: Hidden;
    creationTime: Date;
    deletionTime?: Date;
    destinations?: Array<TDestination>;
};

export type TMap = {
    id: number;
    name: string;
    showName?: string;
    hidden?: Hidden;
    creationTime: Date;
    deletionTime?: Date;
};
