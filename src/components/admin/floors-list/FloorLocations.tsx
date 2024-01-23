import React, { FC } from 'react';
// @ts-ignore
import { Accordion } from 'chayns-components';
import LocationList from './LocationList';
import { CustomDestinationType } from '../../../types/api/destination';

enum LocationType {
    target,
    diningOutlet,
    chargingStation,
    door,
    elevator,
    misc,
}

const LOCATION_TYPES = [{
    customTypes: [CustomDestinationType.target],
    name: 'Lieferpunkte',
    type: LocationType.target,
}, {
    customTypes: [CustomDestinationType.diningOutlet],
    name: 'Ausgabepunkte',
    type: LocationType.diningOutlet,
}, {
    customTypes: [CustomDestinationType.chargingStation],
    name: 'Ladestationen',
    type: LocationType.chargingStation,
}, {
    customTypes: [
        CustomDestinationType.openDoor,
        CustomDestinationType.closeDoor
    ],
    name: 'Türen',
    type: LocationType.door,
}, {
    customTypes: [
        CustomDestinationType.elevator,
        CustomDestinationType.inFrontOfElevator,
        CustomDestinationType.behindElevator
    ],
    name: 'Fahrstühle',
    type: LocationType.elevator,
}, {
    customTypes: [CustomDestinationType.intermediate,],
    name: 'Unzugeordnete Zwischenpunkte',
    type: LocationType.misc,
}]

const FloorLocations: FC<{
    mapId: number,
}> = ({
    mapId,
}) => (
    <div>
        {LOCATION_TYPES.map((locationType) => (
            <LocationList
                key={locationType.type}
                mapId={mapId}
                customTypes={locationType.customTypes}
                name={locationType.name}
                defaultOpened={locationType.type === LocationType.target}
                dataGroup="customTypes"
            />
        ))}
    </div>
);

export default FloorLocations;
