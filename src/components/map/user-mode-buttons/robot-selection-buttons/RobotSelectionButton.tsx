import React, { FC } from 'react';
import clsx from 'clsx';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button } from 'chayns-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectRobotById } from '../../../../redux-modules/robot-status/selectors';
import { selectSelectedRobotId } from '../../../../redux-modules/map/selectors';
import { toggleSelectedRobot } from '../../../../redux-modules/map/actions';

const RobotSelectionButton: FC<{
    robotId: string,
}> = ({
    robotId
}) => {
    const dispatch = useDispatch();

    const robot = useSelector(selectRobotById(robotId));
    const selectedRobotId = useSelector(selectSelectedRobotId);

    if (!robot?.puduRobotStatus?.robotPose) {
        return null;
    }

    return (
        <Button
            className={clsx('pointer-events robot-selection-button', {
                'button--secondary': selectedRobotId !== robotId
            })}
            onClick={() => {
                dispatch(toggleSelectedRobot({ robotId }));
            }}
        >
            {robot?.robotStatus?.robotName}
        </Button>
    )
};

export default RobotSelectionButton;
