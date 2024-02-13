import React, { FC, useMemo } from 'react';
import '../buttons.scss';
import { useSelector } from 'react-redux';
import { getUser, useUser, useWindowMetrics } from 'chayns-api';
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
import { getUserType } from '../../../utils/permissionsHelper';
import { UserType } from '../../../types/misc';
import InformationButton from './robot-controls-buttons/information/InformationButton';
import EditMapButton from './interaction-buttons/EditMapButton';

const UserModeButtons: FC = () => {
    const allMapIds = useSelector(selectMapIds);
    const allRobotIds = useSelector(selectRobotIds);
    const metrics = useWindowMetrics();
    const isPlanningRoute = useSelector(selectIsPlanningRoute);

    const user = useUser();
    const userType = useMemo(() => getUserType(user), [user]);
    const isGuest = useMemo(() => userType === UserType.guest, [userType]);

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
                        className="map-buttons map-buttons-row position-left position-top bot-selection-buttons"
                        style={{
                            flexWrap: 'wrap',
                        }}
                    >
                        {allRobotIds.map((id) => (
                            <RobotSelectionButton
                                key={id}
                                robotId={id as string}
                            />
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
                    {!isGuest && <RouteButton/>}
                    {!isPlanningRoute && !isGuest && <CancelButton/>}
                    {!isPlanningRoute && !isGuest && <ChargeButton/>}
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
                    <FollowRobotButton/>
                    <InformationButton/>
                    {user.uacGroups?.find((group) => group.id === 1) && <EditMapButton/>}
                    <ResetViewButton/>
                </div>
            </div>
        </div>
    )
};

export default UserModeButtons;
