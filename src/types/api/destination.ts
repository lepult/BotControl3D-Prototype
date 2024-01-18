// region Imports
import { TChaynsUser } from './chaynsUser';
import { TAutomationDevice } from './automationDevice';
// endregion

export type TDestination = {
    id: number;
    mapId: number;
    name: string;
    type: DestinationType;
    customType?: CustomDestinationType;
    chaynsUser?: TChaynsUser;
    preposition?: string;
    chaynsCodesUrl?: string;
    automationDevice?: TAutomationDevice;
    roomId: number;
    intermediateDestinations?: Array<TIntermediateDestination>;
    creationTime: Date;
    deletionTime?: Date;
};

export type TDestinationWithShowName = {
    id: number;
    mapId: number;
    name: string;
    showName: string;
    type: DestinationType;
    customType?: CustomDestinationType;
    chaynsUser?: TChaynsUser;
    preposition?: string;
    chaynsCodesUrl?: string;
    roomId: number;
    intermediateDestinations?: Array<TIntermediateDestination>;
    creationTime: Date;
    deletionTime?: Date;
};

export type TIntermediateDestination = {
    id: number;
    destinationId: number;
    intermediateDestinationId: number;
    sequence: number;
    isWayBack: boolean;
    mapId: number;
    name: string;
    type: DestinationType;
    customType?: CustomDestinationType;
    personId?: string;
    preposition?: string;
    chaynsCodesUrl?: string;
    roomId: number;
    creationTime: Date;
    deletionTime?: Date;
}

export enum DestinationType {
    table = 'table',
    diningOutlet = 'dining_outlet',
    transit = 'transit',
    dishwashing = 'dishwashing',
    parking = 'parking',
    chargingPile = 'charging_pile'
}

export enum CustomDestinationType {
    target = 'target-destination',
    diningOutlet = 'dining-outlet-destination',
    intermediate = 'intermediate-destination',
    chargingStation = 'charging-station',
    openDoor = 'open-door',
    closeDoor = 'close-door',
    elevator = 'elevator',
    inFrontOfElevator = 'in-front-of-elevator',
    behindElevator = 'behind-elevator'
}
