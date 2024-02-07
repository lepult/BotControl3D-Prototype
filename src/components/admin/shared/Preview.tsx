import React, { FC } from 'react';
import Map from '../../map/Map';
import FollowRobotButton from '../../user/user-mode-buttons/robot-controls-buttons/follow-robot/FollowRobotButton';
import ResetViewButton from '../../user/user-mode-buttons/interaction-buttons/ResetViewButton';
import { PreviewType } from '../../../types/deckgl-map';

const Preview: FC<{
    robotId?: string,
    mapId: number,
    previewType: PreviewType,
}> = ({
    robotId,
    mapId,
    previewType,
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
            {robotId && <FollowRobotButton/>}
            <ResetViewButton/>
        </div>
        <Map
            mapId={mapId}
            robotId={robotId}
            isPreview
            previewType={previewType}
        />
    </div>
);

export default Preview;
