import { TDestination } from './destination';

export type TRoute = {
    id: number;
    robotId: string;
    personId?: string;
    routeDestinations: Array<TRouteDestination>;
};

export type TRouteDestination = {
    id: number;
    routeId: number;
    destination: TDestination;
    status?: string,
    text: string;
    sequence: number;
    distance?: number;
    robotSpeed?: number;
    startTime?: Date;
    endTime?: Date;
};
