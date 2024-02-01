import React, { FC } from 'react';
import UserModeMap from '../../../user/user-mode-map/UserModeMap';
import FollowRobotButton from '../../../user/user-mode-buttons/robot-controls-buttons/follow-robot/FollowRobotButton';
import ResetViewButton from '../../../user/user-mode-buttons/interaction-buttons/ResetViewButton';

const RobotItemMap: FC<{
    robotId: string,
    mapId: number,
}> = ({
    robotId,
    mapId,
}) => (
    <div
        style={{
            height: '500px',
            width: '100%',
            position: 'relative',
            border: 'solid black 2px',
        }}
    >
        <div
            style={{
                position: 'absolute',
                zIndex: 1,
                right: '10px',
                top: '10px',
                display: 'flex',
                flexDirection: 'column',
            }}
            className="map-buttons"
        >
            <FollowRobotButton/>
            <ResetViewButton/>
        </div>
        <UserModeMap
            mapId={mapId}
            robotId={robotId}
            isPreview
        />
    </div>
);

export default RobotItemMap;
