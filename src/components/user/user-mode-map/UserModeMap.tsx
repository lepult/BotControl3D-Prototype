import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import DeckGL from '@deck.gl/react/typed';
import { ScenegraphLayer, SimpleMeshLayer } from '@deck.gl/mesh-layers/typed';
import { IconLayer, PathLayer } from '@deck.gl/layers/typed';
import { useDispatch, useSelector } from 'react-redux';
import { COORDINATE_SYSTEM, FlyToInterpolator, PickingInfo } from '@deck.gl/core/typed';
import { ViewStateChangeParameters } from '@deck.gl/core/typed/controllers/controller';
import { PathStyleExtension } from '@deck.gl/extensions/typed';
import { OBJLoader } from '@loaders.gl/obj';
import {
    CONTROLLER_DEFAULTS,
    INITIAL_VIEW_STATE,
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
import { IPathData, PreviewType, TViewState } from '../../../types/deckgl-map';
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
import { MapElementType } from '../../../types/pudu-api/robotMap';

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

    const scenegraphLayersData = useMemo(() => getModelsByMapId(mapId), [mapId]);
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

    const pathLayerData = useMemo(() => mapRobotElementsToPathData(pathData?.elements || []), [pathData]);

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

    const getTooltip = (pickingInfo: PickingInfo) => {
        if (pickingInfo?.layer?.id?.startsWith('destinations') && pickingInfo?.object) {
            const iconData = pickingInfo.object as IIconData;
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

        if (pickingInfo?.layer?.id?.startsWith('robots') && pickingInfo?.object) {
            const robotData = pickingInfo.object as TRobotLayerData;
            return {
                html: `
                                <h3 style='margin-top: 0'>
                                    ${robotData.name}
                                </h3>
                            `,
            };
        }

        return null;
    }

    return (
        <div
            onContextMenu={(event) => event.preventDefault()}
        >
            <DeckGL
                viewState={viewState}
                controller={CONTROLLER_DEFAULTS}
                onViewStateChange={(viewStateChagneParameters) => {
                    handleNewViewState(viewStateChagneParameters)
                }}
                getTooltip={getTooltip}
            >
                {(!isPreview || (isPreview && previewType === PreviewType.Floor)) && (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    <IconLayer
                        coordinateSystem={COORDINATE_SYSTEM.METER_OFFSETS}
                        pickable
                        sizeScale={3}
                        getSize={0.3}
                        alphaCutoff={0.5}
                        sizeUnits="meters"
                        id={`destinations__${mapId}`}
                        data={iconLayerData}
                        getPosition={(d: IIconData): [number, number, number] => [d.position[0], d.position[1], 0.5]}
                        onClick={(pickingInfo: PickingInfo) => {
                            const iconData = pickingInfo.object as IIconData;
                            // Disables Selection for non targets when planning the route.
                            if (isPlanningRoute && iconData.customType !== CustomDestinationType.target) {
                                return;
                            }
                            // Unselects selected icon or selects unselected icon.
                            if (selectedDestinationId === iconData.id) {
                                dispatch(changeSelectedDestination(undefined));
                            } else {
                                dispatch(changeSelectedDestination(iconData.id));
                            }
                        }}
                        getIcon={(iconData: IIconData) => ({
                            url: svgToDataURL(getIconByDestinationType(
                                iconData,
                                isPlanningRoute && iconData.customType !== CustomDestinationType.target,
                            )),
                            height: 128,
                            width: 128,
                        })}
                        updateTriggers={{
                            getPosition: [selectedDestinationId],
                            getIcon: [isPlanningRoute],
                        }}
                    />
                )}
                {(!isPreview || (isPreview && previewType === PreviewType.Floor)) && (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    <PathLayer
                        coordinateSystem={COORDINATE_SYSTEM.METER_OFFSETS}
                        pickable
                        jointRounded
                        capRounded
                        billboard
                        widthScale={1}
                        getWidth={0.025}
                        widthMinPixels={0}
                        getColor={(d: { color: [number, number, number] }) => d.color || [0, 0, 0]}
                        extensions={[new PathStyleExtension({ dash: true })]}
                        getDashArray={(data: IPathData) => data.type === MapElementType.track
                            ? [0, 0]
                            : [20, 10]}
                        id={`path-layer__${mapId}`}
                        data={pathLayerData}
                    />
                )}
                {scenegraphLayersData.map((layerData) => (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    <ScenegraphLayer
                        coordinateSystem={COORDINATE_SYSTEM.METER_OFFSETS}
                        pickable
                        sizeScale={1}
                        parameters={{ cull: true }}
                        _lighting="pbr"
                        id={`scenegraphLayer-${mapId}-${layerData.id}`}
                        data={[layerData]}
                        scenegraph={layerData.url}
                        getPosition={layerData.position}
                        getOrientation={layerData.orientation}
                    />
                ))}
                {(!isPreview || (isPreview && previewType === PreviewType.Robot)) && (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    <IconLayer
                        coordinateSystem={COORDINATE_SYSTEM.METER_OFFSETS}
                        sizeScale={1}
                        pickable
                        transitions={{ getPosition: 2000 }}
                        data={robotLayerData}
                        onClick={(pickingInfo: PickingInfo) => {
                            if (isPreview) return;
                            dispatch(toggleSelectedRobot({
                                robotId: (pickingInfo.object as TRobotLayerData).robotId
                            }));
                        }}
                        id={`robots-${mapId}-icon`}
                        billboard
                        sizeUnits="meters"
                        alphaCutoff={0.5}
                        getPosition={(d: TRobotLayerData) => [...d.position, 2]}
                        getIcon={({ icon }: TRobotLayerData) => ({
                            url: icon,
                            height: 128,
                            width: 128,
                        })}
                        getSize={1.5}
                        updateTriggers={{ getIcon: [selectedRobotId] }}
                    />
                )}
                {(!isPreview || (isPreview && previewType === PreviewType.Robot)) && (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    <SimpleMeshLayer
                        sizeScale={1}
                        coordinateSystem={COORDINATE_SYSTEM.METER_OFFSETS}
                        pickable
                        transitions={{
                            getPosition: 2000,
                            getOrientation: 2000,
                        }}
                        data={robotLayerData}
                        onClick={(pickingInfo: PickingInfo) => {
                            if (isPreview) return;
                            dispatch(toggleSelectedRobot({
                                robotId: (pickingInfo.object as TRobotLayerData).robotId
                            }));
                        }}
                        id={`robots-${mapId}-mesh`}
                        mesh="https://chayns.space/77896-05853/3D-Modelle/Kittybot_Compressed2.obj"
                        loaders={[OBJLoader]}
                        getPosition={(d: TRobotLayerData) => [...d.position, 0]}
                        getColor={({ color }: TRobotLayerData) => color}
                        getOrientation={({ orientation }: TRobotLayerData) => orientation}
                        getScale={[1, 1, 1]}
                        updateTriggers={{ getColor: [selectedRobotId] }}
                    />
                )}
            </DeckGL>
        </div>
    );
};

export default UserModeMap;
