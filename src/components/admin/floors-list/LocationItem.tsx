import React, { FC, useMemo } from 'react';
// @ts-ignore
import { Button } from 'chayns-components';
import { useSelector } from 'react-redux';
import { selectDestinationById } from '../../../redux-modules/destination/selectors';

const LocationItem: FC<{
    destinationId: number,
}> = ({
    destinationId
}) => {
    const destination = useSelector(selectDestinationById(destinationId));
    const destinationName = useMemo(() => destination.chaynsUser
        ? `${destination.chaynsUser.name}`
        : destination.name, [destination])
    return (
        <Button>
            {destinationName}
        </Button>
    );
};

export default LocationItem;