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
    index: number,
}> = ({
    mapId,
    customTypes,
    name,
    dataGroup,
    defaultOpened = false,
    index,
}) => {
    const allDestinationsOfMap = useSelector(selectDestinationIdsByMapId(mapId));
    const allDestinationEntities = useSelector(selectDestinationEntities);
    const filteredDestinationIds = useMemo(() => allDestinationsOfMap
            ? allDestinationsOfMap.filter((destinationId) => customTypes.includes(allDestinationEntities[destinationId].customType))
            : [],
        [allDestinationsOfMap, allDestinationEntities, customTypes]);

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                    marginTop: index > 0 ? '15px' : 0,
                }}
            >
                <h3 style={{ margin: 0 }}>{name}</h3>
                <Badge>{filteredDestinationIds.length}</Badge>
            </div>
            {filteredDestinationIds.length > 0 && (
                <div className="location-list-content">
                    {filteredDestinationIds.map((destinationId) => (
                        <LocationItem
                            key={destinationId}
                            destinationId={destinationId}
                            mapId={mapId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default LocationList;
