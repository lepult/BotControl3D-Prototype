import React, { FC, useCallback, useMemo } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button } from 'chayns-components';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectDestinationById } from '../../../../redux-modules/destination/selectors';
import { changeSelectedDestination } from '../../../../redux-modules/misc/actions';
import { selectSelectedDestinationId } from '../../../../redux-modules/misc/selectors';

const Destination: FC<{
    destinationId: number,
}> = ({
    destinationId,
}) => {
    const dispatch = useDispatch();

    const { destination } = useSelector(selectDestinationById(destinationId));
    const destinationFullName = useMemo(() => destination.chaynsUser?.name || destination.name
        , [destination]);

    const selectedDestinationId = useSelector(selectSelectedDestinationId);

    const handleClick = useCallback(() => {
        if (selectedDestinationId === destination.id) {
            dispatch(changeSelectedDestination(undefined));
        } else {
            dispatch(changeSelectedDestination(destination.id));
        }
    }, [selectedDestinationId, destination, dispatch]);

    return (
        <Button
            className={clsx('destination-button', {
                'button--secondary': selectedDestinationId !== destinationId,
            })}
            onClick={() => handleClick()}
        >
            {destinationFullName}
        </Button>
    );
};

export default Destination;