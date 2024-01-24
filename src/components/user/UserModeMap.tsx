/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { FC, useEffect, useMemo, useState } from 'react';
import DeckGL from '@deck.gl/react/typed';
import { ScenegraphLayer, SimpleMeshLayer } from '@deck.gl/mesh-layers/typed';
import { IconLayer, PathLayer } from '@deck.gl/layers/typed';
import { useDispatch, useSelector } from 'react-redux';
// @ts-ignore
import { SmallWaitCursor, Button } from 'chayns-components';
import {
    CONTROLLER_DEFAULTS,
    iconLayerDefaults,
    INITIAL_VIEW_STATE,
    pathLayerDefaults,
    scenegraphLayerDefaults
} from '../../constants/deckGl';
import { mapRobotElementsToIconData, mapRobotElementsToPathData } from '../../utils/dataHelper';
import { getModelsByMapId, getPathDataByMapId } from '../../constants/puduData';
import { selectInitialViewStateByMapId, selectSelectedRobot } from '../../redux-modules/map/selectors';
import { selectSelectedDestination } from '../../redux-modules/misc/selectors';
import { changeSelectedDestination } from '../../redux-modules/misc/actions';
import { IIconData, TViewState } from '../../types/deckgl-map';
import {
    selectRobotEntities,
    selectRobotIds,
} from '../../redux-modules/robot-status/selectors';
import { TPuduApiRobotStatus } from '../../types/pudu-api/robotStatus';
import { COORDINATE_SYSTEM } from '@deck.gl/core/typed';
import { svgToDataURL } from '../../utils/marker';
import { blueMarker, greenMarker, redMarker } from '../../assets/markers';
import { OBJLoader } from '@loaders.gl/obj';
import { toggleSelectedRobot } from '../../redux-modules/map/actions';

type TGltfModel = {
    id: string,
    url: string,
    position: [number, number, number],
    orientation: [number, number, number],
}

const radiansToDegrees = (radians: number) => {
    let pi = Math.PI;
    return radians * (180/pi);
}

const TRANSITION_DURATION = 2000;

const UserModeMap: FC<{
    mapId: number,
}> = ({
    mapId,
}) => {
    const dispatch = useDispatch();

    const selectedDestination = useSelector(selectSelectedDestination(mapId));
    const selectedRobot = useSelector(selectSelectedRobot);

    const robotIds = useSelector(selectRobotIds);
    const robotEntities = useSelector(selectRobotEntities);
    const robots = useMemo(() => {
        const r = robotIds.map((id) => robotEntities[id]);
        return r.filter((robot) => robot?.robotStatus?.currentMap?.id === mapId);
    }, [mapId, robotIds, robotEntities]);

    const robotsPositionsLayerData = useMemo<TPuduApiRobotStatus[]>(() => robots
        .filter((robot) => robot?.puduRobotStatus)
        .map((robot) => ({
            ...robot?.puduRobotStatus,
            name: robot?.robotStatus?.robotName,
            id: robot?.robotStatus?.robotId,
        })),
        [robots]);

    const initialViewState = useSelector(selectInitialViewStateByMapId(mapId));
    const [viewState, setViewState] = useState<TViewState>({
        ...INITIAL_VIEW_STATE,
        ...initialViewState,
    });
    useEffect(() => {
        setViewState((prev) => ({
            ...prev,
            ...initialViewState,
        }));
    }, [initialViewState]);

    const pathData = useMemo(() => getPathDataByMapId(mapId), [mapId]);

    const handleRobotClick = (robotId: string) => {
        console.log('handleRobotClick', robotId);
        dispatch(toggleSelectedRobot({ robotId }));
    };

    const robotLayers = useMemo<[IconLayer, SimpleMeshLayer]>(() => [
        new IconLayer({
            ...iconLayerDefaults,
            id: `robot-icon-layer-${mapId}`,
            sizeScale: 5,
            data: robotsPositionsLayerData,
            getPosition: (i: TPuduApiRobotStatus) => [i.robotPose?.x || 0, i.robotPose?.y || 0, 1.5],
            getSize: (i: TPuduApiRobotStatus) => i.id === selectedRobot ? 1 : 0,
            getIcon: () => ({
                url: svgToDataURL(greenMarker()),
                height: 128,
                width: 128,
            }),
            transitions: { getPosition: TRANSITION_DURATION },
            updateTriggers: {
                getSize: [selectedRobot]
            },
            onClick: (pickingInfo) => handleRobotClick(pickingInfo.object.id),
        }),
        new SimpleMeshLayer({
            coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
            id: `robots-positions-layer123__${mapId}`,
            mesh: 'https://w-lpinkernell-z.tobit.ag/models/Kittybot.obj',
            loaders: [OBJLoader],
            data: robotsPositionsLayerData,
            sizeScale: 1,
            pickable: true,
            getPosition: (i: TPuduApiRobotStatus) => [i.robotPose?.x || 0, i.robotPose?.y || 0, 0],
            getOrientation: (i: TPuduApiRobotStatus) => [0, radiansToDegrees(i.robotPose?.angle || 0) + 90, 90],
            getColor: (i: TPuduApiRobotStatus) => i.id === selectedRobot ? [0, 157, 0] : [157, 0, 0],
            getScale: () => [1, 1, 1],
            transitions: { getPosition: TRANSITION_DURATION },
            updateTriggers: {
                getColor: [selectedRobot]
            },
            onClick: (pickingInfo) => handleRobotClick(pickingInfo.object.id),
        }),
    ], [robotsPositionsLayerData, mapId, selectedRobot]);

    const scenegraphLayers = useMemo<ScenegraphLayer[]>(() => getModelsByMapId(mapId).map((floorModel) => new ScenegraphLayer({
        ...scenegraphLayerDefaults,
        id: `scenegraph-layer__${mapId}__${floorModel.id}`,
        data: [{
            position: floorModel.position,
            orientation: floorModel.orientation,
        }],
        scenegraph: floorModel.url,
        getPosition: (m: TGltfModel) => m.position,
        getOrientation: (m: TGltfModel) => m.orientation,
    })), [mapId]);

    const iconLayerData = useMemo(() => pathData
        ? mapRobotElementsToIconData(pathData.elements, selectedDestination?.destinationName)
        : [],
        [selectedDestination, pathData]);
    const iconLayer = useMemo<IconLayer>(() => new IconLayer({
        ...iconLayerDefaults,
        id: `icon-layer__${mapId}`,
        data: iconLayerData,
        onClick: (pickingInfo) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (selectedDestination?.destinationName === pickingInfo.object.name as string || selectedDestination?.destinationName === pickingInfo.object.id as string) {
                dispatch(changeSelectedDestination(undefined));
            } else {
                dispatch(changeSelectedDestination({
                    mapId,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    destinationName: pickingInfo.object.name as string || pickingInfo.object.id as string,
                }));
            }
        },
        updateTriggers: {
            getPosition: [selectedDestination]
        }
    }), [iconLayerData, selectedDestination, mapId, dispatch]);

    const pathLayerData = useMemo(() => pathData
        ? mapRobotElementsToPathData(pathData.elements)
        : [],
        [pathData]);
    const pathLayer = useMemo<PathLayer>(() => new PathLayer({
        ...pathLayerDefaults,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
        id: `path-layer__${mapId}`,
        data: pathLayerData,
    }), [pathLayerData, mapId]);

    return (
        <div
            onContextMenu={(event) => event.preventDefault()}
        >
            <DeckGL
                viewState={{
                    ...viewState,
                }}
                layers={[
                    ...scenegraphLayers,
                    pathLayer,
                    iconLayer,
                    ...robotLayers,
                ]}
                controller={CONTROLLER_DEFAULTS}
                onViewStateChange={({ viewState: newViewState }) => setViewState(newViewState as TViewState)}
            />
        </div>
    );
};

export default UserModeMap;
