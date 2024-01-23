import React, { FC, useCallback, useMemo } from 'react';
// @ts-ignore
import { Button } from 'chayns-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectDestinationById } from '../../../redux-modules/destination/selectors';
import { changeSelectedDestination } from '../../../redux-modules/misc/actions';
import { selectSelectedDestination } from '../../../redux-modules/misc/selectors';

const LocationItem: FC<{
    destinationId: number,
    mapId: number,
}> = ({
    destinationId,
    mapId,
}) => {
    const dispatch = useDispatch();

    const destination = useSelector(selectDestinationById(destinationId));
    const destinationName = useMemo(() => destination.chaynsUser
        ? `${destination.chaynsUser.name}`
        : destination.name, [destination]);

    const selectedDestination = useSelector(selectSelectedDestination(mapId));

    const handleClick = useCallback(() => {
        if (selectedDestination?.destinationId === destinationId) {
            dispatch(changeSelectedDestination(undefined));
        } else {
            dispatch(changeSelectedDestination({
                destinationId,
                mapId,
                name: destination.name,
            }));
        }
    }, [selectedDestination, destinationId, mapId, destination, dispatch]);

    return (
        <Button
            className={`destination-button${selectedDestination?.destinationId === destinationId ? '' : ' button--secondary'}`}
            onClick={() => handleClick()}
        >
            {destinationName}
        </Button>
    );
};

export default LocationItem;