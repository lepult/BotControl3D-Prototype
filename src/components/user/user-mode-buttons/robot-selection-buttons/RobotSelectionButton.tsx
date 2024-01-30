import React, { FC } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { FilterButton } from 'chayns-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectRobotById } from '../../../../redux-modules/robot-status/selectors';
import { selectSelectedRobot } from '../../../../redux-modules/map/selectors';
import { toggleSelectedRobot } from '../../../../redux-modules/map/actions';

const RobotSelectionButton: FC<{
    robotId: string,
}> = ({
    robotId
}) => {
    const dispatch = useDispatch();

    const robot = useSelector(selectRobotById(robotId));
    const selectedRobot = useSelector(selectSelectedRobot);

    if (!robot?.puduRobotStatus?.robotPose) {
        return null;
    }

    return (
        <FilterButton
            label={robot?.robotStatus?.robotName}
            checked={selectedRobot === robotId}
            onChange={() => {
                dispatch(toggleSelectedRobot({ robotId }));
            }}
        />
    )
};

export default RobotSelectionButton;
