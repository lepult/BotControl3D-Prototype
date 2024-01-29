import React, { FC } from 'react';
// @ts-ignore
import { FilterButton } from 'chayns-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectRobotStatusById } from '../../redux-modules/robot-status/selectors';
import { selectSelectedRobot } from '../../redux-modules/map/selectors';
import { toggleSelectedRobot } from '../../redux-modules/map/actions';

const RobotButton: FC<{
    robotId: string,
}> = ({
    robotId
}) => {
    const dispatch = useDispatch();

    const robot = useSelector(selectRobotStatusById(robotId));
    const selectedRobot = useSelector(selectSelectedRobot);

    return (
        <FilterButton
            label={robot?.robotName}
            checked={selectedRobot === robotId}
            onChange={() => {
                dispatch(toggleSelectedRobot({ robotId }));
            }}
        />
    )
};

export default RobotButton;
