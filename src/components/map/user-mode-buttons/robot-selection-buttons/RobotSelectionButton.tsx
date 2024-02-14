import React, { FC, useMemo } from 'react';
import clsx from 'clsx';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button, Tooltip } from 'chayns-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectRobotById } from '../../../../redux-modules/robot-status/selectors';
import { selectSelectedRobotId } from '../../../../redux-modules/map/selectors';
import { changeSelectedMap, toggleSelectedRobot } from '../../../../redux-modules/map/actions';

const RobotSelectionButton: FC<{
    robotId: string,
}> = ({
    robotId
}) => {
    const dispatch = useDispatch();

    const robot = useSelector(selectRobotById(robotId));
    const selectedRobotId = useSelector(selectSelectedRobotId);

    const isSelected = useMemo(() => selectedRobotId === robotId,
        [selectedRobotId, robotId])

    if (!robot?.puduRobotStatus?.robotPose) {
        return null;
    }

    return (
        <Tooltip
            bindListeners
            content={{ text: isSelected ? 'Auswahl entfernen' : 'Roboter auswählen' }}
        >
            <Button
                className={clsx('pointer-events robot-selection-button', {
                    'button--secondary': !isSelected,
                })}
                onClick={() => {
                    dispatch(toggleSelectedRobot({ robotId }));
                    if (robot?.robotStatus?.currentMap?.id) {
                        dispatch(changeSelectedMap({ mapId: robot?.robotStatus?.currentMap?.id }));
                    }
                }}
            >
                {robot?.robotStatus?.robotName}
            </Button>
        </Tooltip>
    )
};

export default RobotSelectionButton;
