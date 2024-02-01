/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import DeckGL from '@deck.gl/react/typed';
import { ScenegraphLayer } from '@deck.gl/mesh-layers/typed';
import { IconLayer, PathLayer } from '@deck.gl/layers/typed';
import { useDispatch, useSelector } from 'react-redux';
import { FlyToInterpolator, PickingInfo } from '@deck.gl/core/typed';
import { ViewStateChangeParameters } from '@deck.gl/core/typed/controllers/controller';
import {
    CONTROLLER_DEFAULTS,
    iconLayerDefaults,
    INITIAL_VIEW_STATE,
    pathLayerDefaults,
    scenegraphLayerDefaults
} from '../../../constants/deckGl';
import { mapRobotElementsToIconData, mapRobotElementsToPathData } from '../../../utils/dataHelper';
import { getModelsByMapId, getPathDataByMapId } from '../../../constants/puduData';
import {
    selectFollowRobot,
    selectInitialViewStateByMapId,
    selectSelectedRobot
} from '../../../redux-modules/map/selectors';
import { selectResetViewState, selectSelectedDestinationByMapId } from '../../../redux-modules/misc/selectors';
import { changeSelectedDestination } from '../../../redux-modules/misc/actions';
import { IIconData, TViewState } from '../../../types/deckgl-map';
import {
    selectRobotEntities,
    selectRobotIds,
    selectRobotStatusById
} from '../../../redux-modules/robot-status/selectors';
import { changeSelectedMap, toggleFollowRobot, toggleSelectedRobot } from '../../../redux-modules/map/actions';
import { meterToCoordinate, robotAngleToViewStateBearing } from '../../../utils/deckGlHelpers';
import { svgToDataURL } from '../../../utils/marker';
import { getIconByDestinationType } from '../../../utils/icons';
import { selectDestinationEntities, selectDestinationIdsByMapId } from '../../../redux-modules/destination/selectors';
import { TRobotLayerData } from './RobotLayer';
import { getRobotLayerData, getRobotLayers } from '../../../utils/robotLayers';
import { TState } from '../../../redux-modules/robot-status/slice';
import { getScenegraphLayer } from '../../../utils/scenegraphLayer';

interface IPickingInfo extends PickingInfo {
    object: TRobotLayerData,
}

const flyToInterpolator =  new FlyToInterpolator({
    speed: 10,
    maxDuration: 1000,
});

const UserModeMap: FC<{
    mapId: number,
    robotId?: string,
    isPreview?: boolean,
}> = ({
    mapId,
    robotId,
    isPreview = false,
}) => {
    const dispatch = useDispatch();

    const initialViewState = useSelector(selectInitialViewStateByMapId(mapId));
    const resetViewState = useSelector(selectResetViewState);
    const [viewState, setViewState] = useState<TViewState>({
        ...INITIAL_VIEW_STATE,
        ...initialViewState,
    });

    useEffect(() => {
        setViewState((prev) => ({
            ...prev,
            ...initialViewState,
            zoom: initialViewState.zoom - 2,
        }));
    }, [initialViewState, resetViewState]);


    const selectedDestination = useSelector(selectSelectedDestinationByMapId(mapId));
    console.log('selectedDestination', selectedDestination);
    const selectedRobot = useSelector(selectSelectedRobot);

    const selectedRobotStatus = useSelector(selectRobotStatusById(selectedRobot || ''));
    const currentRoute = useMemo(() => selectedRobotStatus?.currentRoute, [selectedRobotStatus]);


    // TODO Write custom selector with change detection.
    const robotIds = useSelector(selectRobotIds);
    const robotEntities = useSelector(selectRobotEntities);
    const robots = useMemo(() => robotIds
        .map((id) => robotEntities[id])
        .filter((robot) => (
            robot?.robotStatus?.currentMap?.id === mapId
            && (robot?.robotStatus?.robotId === robotId || !robotId)
        ))
    , [mapId, robotIds, robotEntities, robotId]);

    const robotLayerData = useMemo<TRobotLayerData[]>(() => robots
            .filter((robot) => robot?.puduRobotStatus)
            .map((robot) => getRobotLayerData(robot as TState, selectedRobot)),
        [robots, selectedRobot]);

    // const robotLayer = useMemo(() => new RobotLayer({
    //     id: `robotLayer-${mapId}`,
    //     data: robotsPositionsLayerData,
    //     updateTriggers: [selectedRobot],
    // }), [mapId, robotsPositionsLayerData, selectedRobot]);

    const robotLayers = useMemo(() => getRobotLayers(
        `robot-${mapId}`,
        robotLayerData,
        isPreview
            ? () => {}
            : (pickingInfo: PickingInfo) => dispatch(toggleSelectedRobot({
                robotId: (pickingInfo as IPickingInfo).object.robotId
            })),
        selectedRobot || '',
    ), [dispatch, mapId, robotLayerData, selectedRobot, isPreview]);


    const scenegraphLayers = useMemo<ScenegraphLayer[]>(() => getModelsByMapId(mapId)
        .map((floorModel) => getScenegraphLayer(floorModel, mapId)), [mapId]);


    const pathData = useMemo(() => getPathDataByMapId(mapId), [mapId]);
    const destinationIds = useSelector(selectDestinationIdsByMapId(mapId));
    const destinationEntities = useSelector(selectDestinationEntities);
    const destinations = useMemo(() => destinationIds?.map((id) => destinationEntities[id]) || [],
        [destinationIds, destinationEntities]);

    const iconLayerData = useMemo(() => pathData
        ? mapRobotElementsToIconData(pathData.elements, selectedDestination?.destinationName, currentRoute, mapId, selectedRobotStatus?.destination, selectedRobotStatus?.currentDestination, destinations)
        : [],
        [selectedDestination, pathData, currentRoute, mapId, selectedRobotStatus, destinations]);

    const iconLayer = useMemo<IconLayer>(() => new IconLayer({
        ...iconLayerDefaults,
        id: `icon-layer__${mapId}`,
        data: iconLayerData,
        getPosition: (d: IIconData) => [d.position[0], d.position[1], 0.5],
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
        getSize: 0.3,
        getIcon: (iconData: IIconData) => ({
            url: svgToDataURL(getIconByDestinationType(iconData)),
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
        if (!selectedRobot && robotId && isPreview) {
            dispatch(toggleSelectedRobot({ robotId }));
        }
    }, [dispatch, robotId, isPreview, selectedRobot]);

    useEffect(() => {
        if (followRobot && selectedRobot) {
            const robot = robotEntities[selectedRobot];

            if (robot) {
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
                    zoom: isPreview ? 21 : 23,
                    bearing,
                }));

                if (robot.robotStatus?.currentMap) {
                    dispatch(changeSelectedMap({ mapId: robot.robotStatus.currentMap?.id }))
                }
            }
        }
    }, [dispatch, followRobot, selectedRobot, robotEntities]);

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
                controller={CONTROLLER_DEFAULTS}
                onViewStateChange={(viewStateChagneParameters) => {
                    handleNewViewState(viewStateChagneParameters)
                }}
            />
        </div>
    );
};

export default UserModeMap;
