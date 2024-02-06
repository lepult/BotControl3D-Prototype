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
    pathLayerDefaults
} from '../../../constants/deckGl';
import {
    getIconDataFromDestinations, IIconData,
    mapRobotElementsToPathData
} from '../../../utils/dataHelper';
import { getModelsByMapId, getPathDataByMapId } from '../../../constants/puduData';
import {
    selectFollowRobot,
    selectInitialViewStateByMapId,
    selectSelectedRobot
} from '../../../redux-modules/map/selectors';
import {
    selectIsPlanningRoute,
    selectResetViewState,
    selectSelectedDestinationId,
} from '../../../redux-modules/misc/selectors';
import { changeSelectedDestination } from '../../../redux-modules/misc/actions';
import { PreviewType, TViewState } from '../../../types/deckgl-map';
import {
    selectRobotEntities,
    selectRobotIds,
    selectRobotStatusById
} from '../../../redux-modules/robot-status/selectors';
import { changeSelectedMap, toggleFollowRobot, toggleSelectedRobot } from '../../../redux-modules/map/actions';
import { meterToCoordinate, robotAngleToViewStateBearing } from '../../../utils/deckGlHelpers';
import { svgToDataURL } from '../../../utils/marker';
import { getIconByDestinationType } from '../../../utils/icons';
import { selectDestinationsByMapId } from '../../../redux-modules/destination/selectors';
import { TRobotLayerData } from './RobotLayer';
import { getRobotLayerData, getRobotLayers } from '../../../utils/robotLayers';
import { TState } from '../../../redux-modules/robot-status/slice';
import { getScenegraphLayer } from '../../../utils/scenegraphLayer';
import { CustomDestinationType } from '../../../types/api/destination';
import { RootState } from '../../../redux-modules';

const flyToInterpolator =  new FlyToInterpolator({
    speed: 10,
    maxDuration: 1000,
});

const UserModeMap: FC<{
    mapId: number,
    robotId?: string,
    isPreview?: boolean,
    previewType?: PreviewType,
}> = ({
    mapId,
    robotId,
    isPreview = false,
    previewType = PreviewType.Robot,
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
            zoom: isPreview ? initialViewState.zoom - 2 : initialViewState.zoom,
        }));
    }, [initialViewState, resetViewState, isPreview]);

    const selectedDestinationId = useSelector(selectSelectedDestinationId);
    const selectedRobotId = useSelector(selectSelectedRobot);

    const selectedRobotStatus = useSelector(selectRobotStatusById(selectedRobotId || ''));
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
            .map((robot) => getRobotLayerData(robot as TState, selectedRobotId)),
        [robots, selectedRobotId]);

    const robotLayers = useMemo(() => (isPreview && previewType === PreviewType.Floor)
        ? []
        : getRobotLayers(
            `robot-${mapId}`,
            robotLayerData,
            isPreview
                ? () => {}
                : (pickingInfo: PickingInfo) => dispatch(toggleSelectedRobot({
                    robotId: (pickingInfo.object as TRobotLayerData).robotId
                })),
            selectedRobotId || '',
    ), [dispatch, mapId, robotLayerData, selectedRobotId, isPreview, previewType]);


    const scenegraphLayers = useMemo<ScenegraphLayer[]>(() => getModelsByMapId(mapId)
        .map((floorModel) => getScenegraphLayer(floorModel, mapId)), [mapId]);


    const pathData = useMemo(() => getPathDataByMapId(mapId), [mapId]);
    const destinations = useSelector((state: RootState) => selectDestinationsByMapId(state, mapId));

    const isPlanningRoute = useSelector(selectIsPlanningRoute);

    const iconLayerData = useMemo(() => getIconDataFromDestinations(
        destinations,
        selectedDestinationId,
        currentRoute,
        selectedRobotStatus?.destination,
        selectedRobotStatus?.currentDestination
    ), [currentRoute, destinations, selectedDestinationId, selectedRobotStatus]);

    const iconLayer = useMemo<IconLayer[]>(() => isPreview && previewType === PreviewType.Robot
        ? []
        : [
            new IconLayer({
                ...iconLayerDefaults,
                id: `destinations__${mapId}`,
                data: iconLayerData,
                getPosition: (d: IIconData) => [d.position[0], d.position[1], 0.5],
                onClick: (pickingInfo) => {
                    const iconData = pickingInfo.object as IIconData;
                    // Disables Selection for non targets when planning the route.
                    if (isPlanningRoute && iconData.customType !== CustomDestinationType.target) {
                        return;
                    }
                    // Unselects selected icon or selects unselected icon.
                    if (selectedDestinationId === iconData.id) {
                        dispatch(changeSelectedDestination(undefined));
                    } else {
                        console.log('changeSelectedDestination', iconData.id);
                        dispatch(changeSelectedDestination(iconData.id));
                    }
                },
                getSize: 0.3,
                getIcon: (iconData: IIconData) => ({
                    url: svgToDataURL(getIconByDestinationType(
                        iconData,
                        isPlanningRoute && iconData.customType !== CustomDestinationType.target,
                    )),
                    height: 128,
                    width: 128,
                }),
                updateTriggers: {
                    getPosition: [selectedDestinationId],
                    getIcon: [isPlanningRoute],
                }
            })
        ], [iconLayerData, selectedDestinationId, mapId, dispatch, isPreview, previewType, isPlanningRoute]);

    const pathLayerData = useMemo(() => pathData
        ? mapRobotElementsToPathData(pathData.elements)
        : [],
        [pathData]);
    const pathLayer = useMemo<PathLayer[]>(() => isPreview && previewType === PreviewType.Robot
        ? []
        : [
            new PathLayer({
                ...pathLayerDefaults,
                id: `path-layer__${mapId}`,
                data: pathLayerData,
            })
        ], [pathLayerData, mapId, isPreview, previewType]);


    const followRobot = useSelector(selectFollowRobot);

    useEffect(() => {
        setViewState((prev) => ({
            ...prev,
            transitionDuration: followRobot ? 2000 : 0,
            transitionInterpolator: followRobot ? flyToInterpolator : undefined,
        }))
    }, [followRobot]);

    useEffect(() => {
        if (!selectedRobotId && robotId && isPreview) {
            dispatch(toggleSelectedRobot({ robotId }));
        }
    }, [dispatch, robotId, isPreview, selectedRobotId]);

    useEffect(() => {
        if (followRobot && selectedRobotId) {
            const robot = robotEntities[selectedRobotId];

            if (robot) {
                const [longitude, latitude] = meterToCoordinate([
                    robot?.puduRobotStatus?.robotPose?.x || 0,
                    robot?.puduRobotStatus?.robotPose?.y || 0,
                ]);
                const bearing = robotAngleToViewStateBearing(robotEntities[selectedRobotId]?.puduRobotStatus?.robotPose?.angle || 0);

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
    }, [dispatch, followRobot, selectedRobotId, robotEntities, isPreview]);

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
                    ...pathLayer,
                    ...iconLayer,
                    ...robotLayers,
                ]}
                controller={CONTROLLER_DEFAULTS}
                onViewStateChange={(viewStateChagneParameters) => {
                    handleNewViewState(viewStateChagneParameters)
                }}
                getTooltip={(a) => {
                    if (a?.layer?.id?.startsWith('destinations') && a?.object) {
                        const iconData = a.object as IIconData;
                        return {
                            html: `
                                <h3 style='margin-top: 0'>
                                    ${iconData.name}
                                </h3>
                                ${iconData.customType
                                    ? `
                                        <p>
                                            ${iconData.customType}
                                        </p>
                                    ` : ''}
                                `
                        };
                    }
                    if (a?.layer?.id?.startsWith('robots') && a?.object) {
                        const robotData = a.object as TRobotLayerData;
                        return {
                            html: `
                                <h3 style='margin-top: 0'>
                                    ${robotData.name}
                                </h3>
                            `,
                        };
                    }
                    return null;
                }}
            />
        </div>
    );
};

export default UserModeMap;
