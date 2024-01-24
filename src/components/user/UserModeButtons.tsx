import React, { FC } from 'react';
import './userModeButtons.scss';
import { useSelector } from 'react-redux';
import { selectMapIds } from '../../redux-modules/map/selectors';
import FloorButton from './FloorButton';
import { selectRobotIds } from '../../redux-modules/robot-status/selectors';
import RobotButton from './RobotButton';

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
                    <RobotButton robotId={id as string}/>
                ))}
            </div>
            <div className="map-buttons position-right position-top">
                Buttons Oben Rechts
            </div>
            <div className="map-buttons position-left position-bottom">
                {allMapIds.map((id) => (
                    <FloorButton mapId={id}/>
                ))}
            </div>
            <div className="map-buttons position-right position-bottom">
                Buttons Unten Rechts
            </div>
        </div>
    )
};

export default UserModeButtons;
