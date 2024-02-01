import React, { FC } from 'react';
// @ts-ignore
import DestinationType from './DestinationType';
import { CustomDestinationType } from '../../../../types/api/destination';

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

const DestinationList: FC<{
    mapId: number,
}> = ({
    mapId,
}) => (
    <div className="accordion__content">
        {LOCATION_TYPES.map((locationType, index) => (
            <DestinationType
                key={locationType.type}
                mapId={mapId}
                customTypes={locationType.customTypes}
                name={locationType.name}
                defaultOpened={locationType.type === LocationType.target}
                dataGroup="customTypes"
                index={index}
            />
        ))}
    </div>
);

export default DestinationList;
