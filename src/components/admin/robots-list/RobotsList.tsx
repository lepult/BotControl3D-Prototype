import React from 'react';
// @ts-ignore
import { Accordion } from 'chayns-components';
import { useSelector } from 'react-redux';
import { selectRobotIds } from '../../../redux-modules/robot-status/selectors';
import RobotItem from './RobotItem';

const RobotsList = () => {
    const robotIds = useSelector(selectRobotIds);

    return (
        <Accordion
            head="Roboter"
            dataGroup="top-level"
        >
            {robotIds.map((robotId) => (
                <RobotItem key={robotId} robotId={robotId as string}/>
            ))}
        </Accordion>
    )
};

export default RobotsList;
