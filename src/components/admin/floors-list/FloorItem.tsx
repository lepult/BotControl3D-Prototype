import React, { FC } from 'react';
// @ts-ignore
import { Accordion, ContextMenu } from 'chayns-components';
import { useDispatch, useSelector } from 'react-redux';
import FloorPreview from './FloorPreview';
import LocationList from './LocationList';
import { selectMapById } from '../../../redux-modules/map/selectors';
import { selectDestinationIdsByMapId } from '../../../redux-modules/destination/selectors';
import { CustomDestinationType } from '../../../types/api/destination';
import { changeAdminModeType } from '../../../redux-modules/misc/actions';
import { AdminModeType } from '../../../types/misc';
import { selectEditingMapId } from '../../../redux-modules/misc/selectors';

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
    name: 'Unzugeordnet',
    type: LocationType.misc,
}]

const FloorItem: FC<{
    mapId: number
}> = ({
    mapId
}) => {
    const dispatch = useDispatch();

    const map = useSelector(selectMapById(mapId));
    const destinations = useSelector(selectDestinationIdsByMapId(mapId));
    const editingMapId = useSelector(selectEditingMapId);
    console.log('destinations', mapId, destinations);

    return (
        <Accordion
            head={map.showName}
            isWrapped
            dataGroup="floors"
            defaultOpened={editingMapId === mapId}
            right={(
                <ContextMenu
                    items={[{
                        text: 'Karte bearbeiten',
                        icon: 'fa fa-pencil',
                        onClick: () => dispatch(changeAdminModeType({
                            adminModeType: AdminModeType.editMap,
                            editingMapId: mapId,
                        })),
                    }]}
                />
            )}
        >
            <div className="accordion__content">
                <FloorPreview
                    mapId={mapId}
                />
            </div>
            {LOCATION_TYPES
                .filter((locationType) => [
                    LocationType.target,
                    LocationType.diningOutlet,
                    LocationType.chargingStation
                ].includes(locationType.type))
                .map((locationType) => (
                <LocationList
                    key={locationType.type}
                    mapId={mapId}
                    customTypes={locationType.customTypes}
                    name={locationType.name}
                    dataGroup="customTypes"
                />
            ))}
            <Accordion
                head="Zwischenpunkte"
                isWrapped
                dataGroup="customTypes"
            >
                {LOCATION_TYPES
                    .filter((locationType) => [
                        LocationType.door,
                        LocationType.elevator,
                        LocationType.misc
                    ].includes(locationType.type))
                    .map((locationType) => (
                    <LocationList
                        key={locationType.type}
                        mapId={mapId}
                        customTypes={locationType.customTypes}
                        name={locationType.name}
                        dataGroup="customTypes-intermediate"
                    />
                ))}
            </Accordion>

        </Accordion>
    );
}

export default FloorItem;
