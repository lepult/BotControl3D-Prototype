import React, { FC } from 'react';
import './userModeButtons.scss';
import { useDispatch, useSelector } from 'react-redux';
// @ts-ignore
import { Button } from 'chayns-components';
import { selectFollowRobot, selectMapIds, selectSelectedRobot } from '../../redux-modules/map/selectors';
import FloorButton from './FloorButton';
import { selectRobotIds } from '../../redux-modules/robot-status/selectors';
import RobotButton from './RobotButton';
import { toggleFollowRobot } from '../../redux-modules/map/actions';

const UserModeButtons: FC = () => {
    const dispatch = useDispatch();

    const allMapIds = useSelector(selectMapIds);
    const allRobotIds = useSelector(selectRobotIds);
    const selectedRobot = useSelector(selectSelectedRobot);
    const followRobot = useSelector(selectFollowRobot);

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
                <Button
                    disabled={!selectedRobot}
                    className={followRobot ? '' : 'button--secondary'}
                    onClick={() => dispatch(toggleFollowRobot())}
                >
                    <i className="fa-solid fa-location-arrow"/>
                </Button>
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
