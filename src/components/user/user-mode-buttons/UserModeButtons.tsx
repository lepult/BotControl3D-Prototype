import React, { FC } from 'react';
import './userModeButtons.scss';
import { useSelector } from 'react-redux';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { selectMapIds } from '../../../redux-modules/map/selectors';
import FloorSelectionButton from './floor-buttons/FloorSelectionButton';
import { selectRobotIds } from '../../../redux-modules/robot-status/selectors';
import RobotSelectionButton from './robot-selection-buttons/RobotSelectionButton';
import RouteButton from './robot-controls-buttons/RouteButton';
import ChargeButton from './robot-controls-buttons/ChargeButton';
import CancelButton from './robot-controls-buttons/CancelButton';
import FollowRobotButton from './interaction-buttons/FollowRobotButton';

const UserModeButtons: FC = () => {

    const allMapIds = useSelector(selectMapIds);
    const allRobotIds = useSelector(selectRobotIds);

    return (
        <div className="user-mode-buttons__wrapper">
            <div
                className="map-buttons map-buttons-row position-left position-top"
                style={{ flexWrap: 'wrap' }}
            >
                {allRobotIds.map((id) => (
                    <RobotSelectionButton robotId={id as string}/>
                ))}
            </div>
            <div className="map-buttons position-right position-top">
                <RouteButton/>
                <ChargeButton/>
                <CancelButton/>
            </div>
            <div className="map-buttons position-left position-bottom">
                {allMapIds.map((id) => (
                    <FloorSelectionButton mapId={id}/>
                ))}
            </div>
            <div className="map-buttons position-right position-bottom">
                <FollowRobotButton/>
            </div>
        </div>
    )
};

export default UserModeButtons;
