import React, { FC, useCallback, useMemo } from 'react';
// @ts-ignore
import { Button } from 'chayns-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectDestinationById } from '../../../../redux-modules/destination/selectors';
import { changeSelectedDestination } from '../../../../redux-modules/misc/actions';
import { selectSelectedDestinationByMapId } from '../../../../redux-modules/misc/selectors';

const Destination: FC<{
    destinationId: number,
    mapId: number,
}> = ({
    destinationId,
    mapId,
}) => {
    const dispatch = useDispatch();

    const destination = useSelector(selectDestinationById(destinationId));
    const destinationFullName = useMemo(() => destination.chaynsUser
        ? `${destination.chaynsUser.name}`
        : destination.name, [destination]);

    const selectedDestination = useSelector(selectSelectedDestinationByMapId(mapId));

    const handleClick = useCallback(() => {
        if (selectedDestination?.destinationName === destination.name) {
            dispatch(changeSelectedDestination(undefined));
        } else {
            dispatch(changeSelectedDestination({
                mapId,
                destinationName: destination.name,
            }));
        }
    }, [selectedDestination, destinationId, mapId, destination, dispatch]);

    return (
        <Button
            className={`destination-button${selectedDestination?.destinationName === destination.name ? '' : ' button--secondary'}`}
            onClick={() => handleClick()}
        >
            {destinationFullName}
        </Button>
    );
};

export default Destination;