import React, { FC, useMemo } from 'react';
import { IconLayer } from '@deck.gl/layers/typed';
import { getIconDataFromDestinations, IIconData } from '../../../../utils/dataHelper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux-modules';
import { selectDestinationsByMapId } from '../../../../redux-modules/destination/selectors';
import { selectIsPlanningRoute, selectSelectedDestinationId } from '../../../../redux-modules/misc/selectors';
import { selectRobotStatusById } from '../../../../redux-modules/robot-status/selectors';
import { selectSelectedRobot } from '../../../../redux-modules/map/selectors';
import { COORDINATE_SYSTEM, PickingInfo } from '@deck.gl/core/typed';
import { CustomDestinationType } from '../../../../types/api/destination';
import { changeSelectedDestination } from '../../../../redux-modules/misc/actions';
import { svgToDataURL } from '../../../../utils/marker';
import { getIconByDestinationType } from '../../../../utils/icons';

const DestinationsLayer: FC<{
    mapId: number,
}> = ({
    mapId,
}) => {
    const dispatch = useDispatch();

    const destinations = useSelector((state: RootState) => selectDestinationsByMapId(state, mapId));
    const selectedDestinationId = useSelector(selectSelectedDestinationId);

    const selectedRobotId = useSelector(selectSelectedRobot);
    const selectedRobotStatus = useSelector(selectRobotStatusById(selectedRobotId || ''));

    const currentRoute = useMemo(() => selectedRobotStatus?.currentRoute, [selectedRobotStatus]);
    const destination = useMemo(() => selectedRobotStatus?.destination, [selectedRobotStatus]);
    const currentDestination = useMemo(() => selectedRobotStatus?.currentDestination, [selectedRobotStatus]);

    const iconLayerData = useMemo(() => getIconDataFromDestinations(
        destinations,
        selectedDestinationId,
        currentRoute,
        destination,
        currentDestination
    ), [currentDestination, currentRoute, destination, destinations, selectedDestinationId]);

    const isPlanningRoute = useSelector(selectIsPlanningRoute);

    return (

    );
};

export default DestinationsLayer;
