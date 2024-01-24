/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { FC, useEffect, useMemo, useState } from 'react';
import DeckGL from '@deck.gl/react/typed';
import { ScenegraphLayer } from '@deck.gl/mesh-layers/typed';
import { IconLayer, PathLayer } from '@deck.gl/layers/typed';
import { useDispatch, useSelector } from 'react-redux';
// @ts-ignore
import { SmallWaitCursor, Button } from 'chayns-components';
import {
    iconLayerDefaults,
    INITIAL_VIEW_STATE,
    pathLayerDefaults,
    scenegraphLayerDefaults
} from '../../constants/deckGl';
import { mapRobotElementsToIconData, mapRobotElementsToPathData } from '../../utils/dataHelper';
import { getModelsByMapId, getPathDataByMapId } from '../../constants/puduData';
import { selectInitialViewStateByMapId } from '../../redux-modules/map/selectors';
import { selectSelectedDestination } from '../../redux-modules/misc/selectors';
import { changeSelectedDestination } from '../../redux-modules/misc/actions';
import { IIconData, TViewState } from '../../types/deckgl-map';
import {
    selectRobotEntities,
    selectRobotIds,
    selectRobotsByCurrentMap
} from '../../redux-modules/robot-status/selectors';
import { TPuduApiRobotStatus } from '../../types/pudu-api/robotStatus';
import { robotStatusName } from '../../redux-modules/robot-status/slice';
import { svgToDataURL } from '../../utils/marker';
import { blueMarker, redMarker } from '../../assets/markers';
import { COORDINATE_SYSTEM } from '@deck.gl/core/typed';

type TGltfModel = {
    id: string,
    url: string,
    position: [number, number, number],
    orientation: [number, number, number],
}

const UserModeMap: FC<{
    mapId: number,
}> = ({
    mapId,
}) => {
    const dispatch = useDispatch();

    const selectedDestination = useSelector(selectSelectedDestination(mapId));

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

    const robotsPositionsLayer2 = useMemo<ScenegraphLayer>(() => new ScenegraphLayer({
        coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
        parameters: { cull: true },
        pickable: true,
        sizeScale: 1,
        _lighting: 'pbr',        // sizeScale: 10,
        // parameters: { cull: false },
        id: `robots-positions-layer__${mapId}`,
        data: robotsPositionsLayerData,
        scenegraph: 'https://w-lpinkernell-z.tobit.ag/models/Kittybot.glb',
        getPosition: (i: TPuduApiRobotStatus) => [i.robotPose?.x || 0, i.robotPose?.y || 0, 0],
        getOrientation: (i: TPuduApiRobotStatus) => [0, i.robotPose?.angle || 0, 90],
    }), [robotsPositionsLayerData, mapId]);

    const robotsPositionsLayer = useMemo<IconLayer>(() => new IconLayer({
        // ...iconLayerDefaults,
        id: `robots-positions-layer__${mapId}`,
        data: [], //robotsPositionsLayerData,
        // getPosition: (i: TPuduApiRobotStatus) => [i.robotPose?.x || 0, i.robotPose?.y || 0, 0],
        // getIcon: (d: IIconData) => ({
        //     url: svgToDataURL(redMarker()),
        //     height: 128,
        //     width: 128,
        // }),
    }), [robotsPositionsLayerData, mapId]);

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

    useEffect(() => {
        console.log('scenegraphLayers', scenegraphLayers);
    }, [scenegraphLayers]);

    useEffect(() => {
        console.log('robotsPositionsLayerData', robotsPositionsLayerData);
    }, [robotsPositionsLayerData]);

    useEffect(() => {
        console.log('robotsPositionsLayer', robotsPositionsLayer);
    }, [robotsPositionsLayer]);


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

    useEffect(() => {
        console.log('iconLayerData', iconLayerData);
    }, [iconLayerData]);
    useEffect(() => {
        console.log('iconLayer', iconLayer);
    }, [iconLayer]);

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

    useEffect(() => {
        console.log('pathLayer', pathLayer);
    }, [pathLayer]);

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
                    // demoPolygonLayer,
                    pathLayer,
                    iconLayer,
                    robotsPositionsLayer,
                    robotsPositionsLayer2,
                ]}
                controller
                onViewStateChange={({ viewState: newViewState }) => setViewState(newViewState as TViewState)}
            />
        </div>
    );
};

export default UserModeMap;
