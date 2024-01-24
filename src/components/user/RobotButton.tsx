import React, { FC } from 'react';
// @ts-ignore
import { FilterButton } from 'chayns-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectRobotStatusById } from '../../redux-modules/robot-status/selectors';
import { selectSelectedMap, selectSelectedRobot } from '../../redux-modules/map/selectors';
import { changeSelectedRobot } from '../../redux-modules/map/actions';

const RobotButton: FC<{
    robotId: string,
}> = ({
    robotId
}) => {
    const dispatch = useDispatch();

    const robot = useSelector(selectRobotStatusById(robotId));
    const selectedMap = useSelector(selectSelectedMap);
    const selectedRobot = useSelector(selectSelectedRobot);

    if (robot?.currentMap?.id !== selectedMap) {
        return null;
    }



    return (
        <FilterButton
            label={robot?.robotName}
            checked={selectedRobot === robotId}
            onChange={(checked: boolean) => {
                dispatch(changeSelectedRobot({ robotId: checked ? robotId : undefined }));
            }}
        />
    )
};

export default RobotButton;
