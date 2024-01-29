/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DeckGL from '@deck.gl/react/typed';
import { ScenegraphLayer, SimpleMeshLayer } from '@deck.gl/mesh-layers/typed';
import { IconLayer, PathLayer, TextLayer } from '@deck.gl/layers/typed';
import { useDispatch, useSelector } from 'react-redux';
import { FlyToInterpolator, Layer, PickingInfo } from '@deck.gl/core/typed';
import { ViewStateChangeParameters } from '@deck.gl/core/typed/controllers/controller';
import {
    CONTROLLER_DEFAULTS,
    iconLayerDefaults,
    INITIAL_VIEW_STATE,
    pathLayerDefaults, robotsSimpleMeshLayerDefaults, robotStatusTextLayerDefaults,
    scenegraphLayerDefaults
} from '../../constants/deckGl';
import { mapRobotElementsToIconData, mapRobotElementsToPathData } from '../../utils/dataHelper';
import { getModelsByMapId, getPathDataByMapId } from '../../constants/puduData';
import {
    selectFollowRobot,
    selectInitialViewStateByMapId,
    selectSelectedRobot
} from '../../redux-modules/map/selectors';
import { selectSelectedDestination } from '../../redux-modules/misc/selectors';
import { changeSelectedDestination } from '../../redux-modules/misc/actions';
import { IIconData, MapRobotStatus, TViewState } from '../../types/deckgl-map';
import {
    selectRobotEntities,
    selectRobotIds, selectRobotStatusById
} from '../../redux-modules/robot-status/selectors';
import { TPuduApiRobotStatus } from '../../types/pudu-api/robotStatus';
import { toggleFollowRobot, toggleSelectedRobot } from '../../redux-modules/map/actions';
import { getMapRobotStatus } from '../../utils/robotStatusHelper';
import { getRobotColor, getRobotOrientation, getRobotPosition } from '../../utils/deckGlDataAccessors';
import { meterToCoordinate, robotAngleToViewStateBearing } from '../../utils/deckGlHelpers';
import { svgToDataURL } from '../../utils/marker';
import { blueMarker, getColoredMarker, redMarker } from '../../assets/markers';

type TGltfModel = {
    id: string,
    url: string,
    position: [number, number, number],
    orientation: [number, number, number],
}

type TRobotMapData = {
    name: string,
    id: string,
    puduRobotStatus: TPuduApiRobotStatus,
    mapRobotStatus: MapRobotStatus,
}

interface IPickingInfo extends PickingInfo {
    object: TRobotMapData,
}

const flyToInterpolator =  new FlyToInterpolator({
    speed: 10,
    maxDuration: 1000,
});

// const flyToInterpolator =  new LinearInterpolator({
//     transitionProps: ['longitude', 'latitude'],
// });

const UserModeMap: FC<{
    mapId: number,
}> = ({
    mapId,
}) => {
    const dispatch = useDispatch();

    const [controller] = useState(CONTROLLER_DEFAULTS);

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


    const selectedDestination = useSelector(selectSelectedDestination(mapId));
    const selectedRobot = useSelector(selectSelectedRobot);

    const selectedRobotStatus = useSelector(selectRobotStatusById(selectedRobot || ''));
    const currentRoute = useMemo(() => selectedRobotStatus?.currentRoute, [selectedRobotStatus]);
    useEffect(() => {
        console.log('currentRoute', currentRoute);
    }, [currentRoute]);

    const robotIds = useSelector(selectRobotIds);
    const robotEntities = useSelector(selectRobotEntities);
    const robots = useMemo(() => {
        const r = robotIds.map((id) => robotEntities[id]);
        return r.filter((robot) => robot?.robotStatus?.currentMap?.id === mapId);
    }, [mapId, robotIds, robotEntities]);


    const robotsPositionsLayerData = useMemo<TRobotMapData[]>(() => robots
            .filter((robot) => robot?.puduRobotStatus)
            .map((robot) => ({
                puduRobotStatus: robot?.puduRobotStatus as TPuduApiRobotStatus,
                name: robot?.robotStatus?.robotName as string,
                id: robot?.robotStatus?.robotId as string,
                mapRobotStatus: getMapRobotStatus(
                    robotEntities[robot?.robotStatus?.robotId || 0]?.robotStatus,
                    robotEntities[robot?.robotStatus?.robotId || 0]?.puduRobotStatus
                ),
            })),
        [robots, robotEntities]);

    const robotLayerDataAccessors = useMemo<Partial<Layer>>(() => ({
        data: robotsPositionsLayerData,
        getOrientation: (d: TRobotMapData) => getRobotOrientation(d.puduRobotStatus.robotPose?.angle || 0),
        getColor: (d: TRobotMapData) => getRobotColor(d.id === selectedRobot),
        // @ts-ignore
        onClick: (pickingInfo: IPickingInfo) => dispatch(toggleSelectedRobot({ robotId: pickingInfo.object.id })),
        updateTriggers: {
            getColor: [selectedRobot]
        },
    }), [dispatch, robotsPositionsLayerData, selectedRobot]);

    const robotLayers = useMemo<[TextLayer, SimpleMeshLayer]>(() => [
        new TextLayer({
            ...robotStatusTextLayerDefaults,
            ...robotLayerDataAccessors,
            id: `text-layer-${mapId}`,
            getPosition: (d: TRobotMapData) => getRobotPosition(d.puduRobotStatus.robotPose, 1.5),
            getText: (d: TRobotMapData) => d.mapRobotStatus,
        }),
        new SimpleMeshLayer({
            ...robotsSimpleMeshLayerDefaults,
            ...robotLayerDataAccessors,
            id: `robots-positions-layer123__${mapId}`,
            getPosition: (d: TRobotMapData) => getRobotPosition(d.puduRobotStatus.robotPose, 0),
        }),
    ], [mapId, robotLayerDataAccessors]);


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


    const pathData = useMemo(() => getPathDataByMapId(mapId), [mapId]);

    const iconLayerData = useMemo(() => pathData
        ? mapRobotElementsToIconData(pathData.elements, selectedDestination?.destinationName, currentRoute, mapId, selectedRobotStatus?.destination, selectedRobotStatus?.currentDestination)
        : [],
        [selectedDestination, pathData, currentRoute, mapId]);
    useEffect(() => {
        console.log('iconLayerData', iconLayerData.filter((i) => i.routeData.isFinalDestination || i.routeData.isRouteDestination));
    }, [iconLayerData]);
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
        getIcon: (d: IIconData) => ({
            // eslint-disable-next-line no-nested-ternary
            url: svgToDataURL(d.routeData.isFinalDestination
                ? getColoredMarker(0, 255, 0)
                // eslint-disable-next-line no-nested-ternary
                : d.routeData.isNextDestination
                    ? getColoredMarker(0, 50, 0)
                    // eslint-disable-next-line no-nested-ternary
                    : d.routeData.isRouteDestination && !d.routeData.isEarlierDestination
                        ? getColoredMarker(255, 0, 0)
                        : d.selected
                            ? getColoredMarker(200, 200, 200)
                            : getColoredMarker(0, 0, 255)
            ),
            height: 128,
            width: 128,
        }),
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
        // extensions: [new PathStyleExtension({ dash: true })],
    }), [pathLayerData, mapId]);


    const followRobot = useSelector(selectFollowRobot);

    useEffect(() => {
        setViewState((prev) => ({
            ...prev,
            transitionDuration: followRobot ? 2000 : 0,
            transitionInterpolator: followRobot ? flyToInterpolator : undefined,
        }))
    }, [followRobot]);

    useEffect(() => {
        if (followRobot && selectedRobot) {
            const robot = robotEntities[selectedRobot];
            const [longitude, latitude] = meterToCoordinate([
                robot?.puduRobotStatus?.robotPose?.x || 0,
                robot?.puduRobotStatus?.robotPose?.y || 0,
            ]);
            const bearing = robotAngleToViewStateBearing(robotEntities[selectedRobot]?.puduRobotStatus?.robotPose?.angle || 0);

            setViewState((prev) => ({
                ...prev,
                latitude,
                longitude,
                pitch: 55,
                zoom: 23,
                bearing,
            }));
        }
    }, [followRobot, selectedRobot, robotEntities]);

    const handleNewViewState = useCallback((viewStateChagneParameters: ViewStateChangeParameters) => {
        const interaction = viewStateChagneParameters.interactionState;
        if (followRobot && (interaction.isDragging || interaction.isPanning || interaction.isZooming || interaction.isRotating)) {
            dispatch(toggleFollowRobot());
        }

        setViewState((prev) => ({
            ...prev,
            ...viewStateChagneParameters.viewState,
        }));
    }, [dispatch, followRobot]);


    return (
        <div
            onContextMenu={(event) => event.preventDefault()}
        >
            <DeckGL
                viewState={viewState}
                layers={[
                    ...scenegraphLayers,
                    pathLayer,
                    iconLayer,
                    ...robotLayers,
                ]}
                controller={controller}
                onViewStateChange={(viewStateChagneParameters) => {
                    handleNewViewState(viewStateChagneParameters)
                }}
            />
        </div>
    );
};

export default UserModeMap;
