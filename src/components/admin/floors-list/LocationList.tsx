import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
// @ts-ignore
import { Accordion, Badge } from 'chayns-components';
import { CustomDestinationType } from '../../../types/api/destination';
import { selectDestinationEntities, selectDestinationIdsByMapId } from '../../../redux-modules/destination/selectors';
import LocationItem from './LocationItem';
import './locationList.scss';

const LocationList: FC<{
    mapId: number
    customTypes: (CustomDestinationType | undefined)[],
    name: string,
    dataGroup: string,
    defaultOpened?: boolean,
}> = ({
    mapId,
    customTypes,
    name,
    dataGroup,
    defaultOpened = false,
}) => {
    const allDestinationsOfMap = useSelector(selectDestinationIdsByMapId(mapId));
    const allDestinationEntities = useSelector(selectDestinationEntities);
    const filteredDestinationIds = useMemo(() => allDestinationsOfMap
            ? allDestinationsOfMap.filter((destinationId) => customTypes.includes(allDestinationEntities[destinationId].customType))
            : [],
        [allDestinationsOfMap, allDestinationEntities, customTypes]);

    return (
        <Accordion
            head={name}
            isWrapped
            dataGroup={dataGroup}
            defaultOpened={defaultOpened}
            right={<Badge>{filteredDestinationIds.length}</Badge>}
            disabled={filteredDestinationIds.length === 0}
        >
            <div className="accordion__content location-list-content">
                {filteredDestinationIds.map((destinationId) => (
                    <LocationItem
                        key={destinationId}
                        destinationId={destinationId}
                        mapId={mapId}
                    />
                ))}
            </div>
        </Accordion>
    );
}

export default LocationList;
