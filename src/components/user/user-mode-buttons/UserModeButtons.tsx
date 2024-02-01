import React, { FC } from 'react';
import './userModeButtons.scss';
import { useSelector } from 'react-redux';
import { useWindowMetrics } from 'chayns-api';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { selectMapIds } from '../../../redux-modules/map/selectors';
import FloorSelectionButton from './floor-buttons/FloorSelectionButton';
import { selectRobotIds } from '../../../redux-modules/robot-status/selectors';
import RobotSelectionButton from './robot-selection-buttons/RobotSelectionButton';
import RouteButton from './robot-controls-buttons/route/RouteButton';
import ChargeButton from './robot-controls-buttons/charge/ChargeButton';
import CancelButton from './robot-controls-buttons/cancel/CancelButton';
import FollowRobotButton from './robot-controls-buttons/follow-robot/FollowRobotButton';
import ResetViewButton from './interaction-buttons/ResetViewButton';
import { selectIsPlanningRoute } from '../../../redux-modules/misc/selectors';

const UserModeButtons: FC = () => {
    const allMapIds = useSelector(selectMapIds);
    const allRobotIds = useSelector(selectRobotIds);
    const metrics = useWindowMetrics();
    const isPlanningRoute = useSelector(selectIsPlanningRoute);

    return (
        <div className="user-mode-buttons__wrapper">
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                }}
            >
                {(metrics.pageWidth > 900 || !isPlanningRoute) && (
                    <div
                        className="map-buttons map-buttons-row position-left position-top"
                        style={{
                            flexWrap: 'wrap',
                            width: 'calc(100% - 520px)',
                        }}
                    >
                        {allRobotIds.map((id) => (
                            <RobotSelectionButton robotId={id as string}/>
                        ))}
                    </div>
                )}

                <div
                    className="map-buttons"
                    style={{
                        alignItems: 'end',
                        top: 0,
                        left: 0,
                        right: 0,
                        padding: '10px',
                    }}
                >
                    <RouteButton/>
                    {!isPlanningRoute && <FollowRobotButton/>}
                    {!isPlanningRoute && <ChargeButton/>}
                    {!isPlanningRoute && <CancelButton/>}
                </div>
                <div className="map-buttons position-left position-bottom">
                    {allMapIds.map((id) => (
                        <FloorSelectionButton
                            key={id}
                            mapId={id}
                        />
                    ))}
                </div>
                <div className="map-buttons position-right position-bottom">
                    <ResetViewButton/>
                </div>
            </div>
        </div>
    )
};

export default UserModeButtons;
