import React, { FC, useMemo } from 'react';
import clsx from 'clsx';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button, Tooltip } from 'chayns-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectMapById, selectSelectedMap, selectSelectedRobotId } from '../../../../redux-modules/map/selectors';
import { getPathDataByMapId } from '../../../../constants/getMapData';
import { changeSelectedMap, setFollowRobot } from '../../../../redux-modules/map/actions';
import { selectRobotStatusById } from '../../../../redux-modules/robot-status/selectors';

const FloorSelectionButton: FC<{
    mapId: number,
}> = ({
    mapId,
}) => {
    const dispatch = useDispatch();
    const selectedMap = useSelector(selectSelectedMap);
    const map = useSelector(selectMapById(mapId));
    const pathData = getPathDataByMapId(mapId);
    const selectedRobotId = useSelector(selectSelectedRobotId);
    const selectedRobot = useSelector(selectRobotStatusById(selectedRobotId || ''));

    const isSelected = useMemo(() => selectedMap === mapId,
        [selectedRobot, mapId])

    if (map.hidden || !pathData) {
        return null;
    }

    return (
        <Tooltip
            bindListeners
            content={{ text: isSelected ? 'Auswahl entfernen' : 'Stockwerk auswählen' }}
        >
            <Button
                className={clsx('list-button pointer-events', {
                    'button--secondary': !isSelected,
                    'button--bordered': selectedRobot?.currentMap?.id === mapId,
                })}
                onClick={() => {
                    dispatch(changeSelectedMap({ mapId }));
                    dispatch(setFollowRobot({ followRobot: false }));
                }}
            >
                {map.showName}
            </Button>
        </Tooltip>
    );
};

export default FloorSelectionButton;
