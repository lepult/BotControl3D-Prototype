import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import DeckGL from '@deck.gl/react/typed';
import { ScenegraphLayer, SimpleMeshLayer } from '@deck.gl/mesh-layers/typed';
import { IconLayer, PathLayer } from '@deck.gl/layers/typed';
import { useDispatch, useSelector } from 'react-redux';
import { FlyToInterpolator, PickingInfo } from '@deck.gl/core/typed';
import { ViewStateChangeParameters } from '@deck.gl/core/typed/controllers/controller';
import { CONTROLLER_DEFAULTS, INITIAL_VIEW_STATE } from '../../../constants/deckGl';
import { IIconData, mapRobotElementsToPathData } from '../../../utils/dataHelper';
import { getModelsByMapId, getPathDataByMapId } from '../../../constants/puduData';
import {
    selectFollowRobot,
    selectInitialViewStateByMapId,
    selectSelectedRobotId
} from '../../../redux-modules/map/selectors';
import { selectResetViewState, } from '../../../redux-modules/misc/selectors';
import { toggleSelectedDestination } from '../../../redux-modules/misc/actions';
import { PreviewType, TViewState } from '../../../types/deckgl-map';
import { selectRobotLayerData, selectSelectedRobot } from '../../../redux-modules/robot-status/selectors';
import { changeSelectedMap, toggleFollowRobot, toggleSelectedRobot } from '../../../redux-modules/map/actions';
import { meterToCoordinate, robotAngleToViewStateBearing } from '../../../utils/deckGlHelpers';
import { svgToDataURL } from '../../../utils/marker';
import { getIconByDestinationType } from '../../../utils/icons';
import { selectDestinationsLayerData } from '../../../redux-modules/destination/selectors';
import { TRobotLayerData } from './RobotLayer';
import { RootState } from '../../../redux-modules';
import {
    DEFAULT_DESTINATION_LAYER_PROPS,
    DEFAULT_ICON_LAYER_PROPS,
    DEFAULT_LAYER_PROPS,
    DEFAULT_PATH_LAYER_PROPS,
    DEFAULT_ROBOT_ICON_LAYER_PROPS,
    DEFAULT_ROBOT_LAYER_PROPS,
    DEFAULT_ROBOT_MESH_LAYER_PROPS,
    DEFAULT_SCENEGRAPH_LAYER_PROPS,
    getLayerIcon
} from '../../../constants/deckGlLayers';

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

    const selectedRobotId = useSelector(selectSelectedRobotId);
    const selectedRobot = useSelector(selectSelectedRobot);

    // region LayerData
    const iconLayerData = useSelector((state: RootState) => selectDestinationsLayerData(state, mapId));
    const pathLayerData = useMemo(() => mapRobotElementsToPathData(
        getPathDataByMapId(mapId)?.elements || []
    ), [mapId]);
    const robotLayerData = useSelector((state: RootState) => selectRobotLayerData(state, {
        isPreview,
        previewMapRobotId: robotId,
        mapId,
    }));
    const scenegraphLayersData = useMemo(() => getModelsByMapId(mapId), [mapId]);
    // endregion

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

    // Makes the camera follow the selected Robot, when followRobot is true.
    useEffect(() => {
        if (followRobot && selectedRobotId) {
            if (selectedRobot) {
                const [longitude, latitude] = meterToCoordinate([
                    selectedRobot?.puduRobotStatus?.robotPose?.x || 0,
                    selectedRobot?.puduRobotStatus?.robotPose?.y || 0,
                ]);
                const bearing = robotAngleToViewStateBearing(selectedRobot.puduRobotStatus?.robotPose?.angle || 0);

                setViewState((prev) => ({
                    ...prev,
                    latitude,
                    longitude,
                    pitch: 55,
                    zoom: isPreview ? 21 : 23,
                    bearing,
                }));

                if (selectedRobot.robotStatus?.currentMap) {
                    dispatch(changeSelectedMap({ mapId: selectedRobot.robotStatus.currentMap?.id }))
                }
            }
        }
    }, [dispatch, followRobot, selectedRobotId, selectedRobot, isPreview]);

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
                html: `<h3 style='margin-top: 0'>${iconData.name}</h3>
                    ${iconData.customType ? `<p>${iconData.customType}</p>` : ''}`
            };
        }

        if (pickingInfo?.layer?.id?.startsWith('robots') && pickingInfo?.object) {
            const robotData = pickingInfo.object as TRobotLayerData;
            return { html: `<h3 style='margin-top: 0'>${robotData.name}</h3>` };
        }

        return null;
    };

    const handleRobotLayerClick = useCallback((pickingInfo: PickingInfo) => {
        if (isPreview) return;
        dispatch(toggleSelectedRobot({
            robotId: (pickingInfo.object as TRobotLayerData).robotId
        }));
    }, [dispatch, isPreview]);

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
                        {...DEFAULT_LAYER_PROPS}
                        {...DEFAULT_ICON_LAYER_PROPS}
                        {...DEFAULT_DESTINATION_LAYER_PROPS}
                        data={iconLayerData}
                        id={`destinations__${mapId}`}
                        getIcon={(iconData: IIconData) => getLayerIcon(svgToDataURL(getIconByDestinationType(iconData)))}
                        onClick={(pickingInfo: PickingInfo) => {
                            const iconData = pickingInfo.object as IIconData;
                            // Disables Selection for non targets when planning the route.
                            if (iconData.invalid) {
                                return;
                            }
                            // Unselects selected icon or selects unselected icon.
                            dispatch(toggleSelectedDestination(iconData.id));
                        }}
                    />
                )}
                {(!isPreview || (isPreview && previewType === PreviewType.Floor)) && (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    <PathLayer
                        {...DEFAULT_LAYER_PROPS}
                        {...DEFAULT_PATH_LAYER_PROPS}
                        data={pathLayerData}
                        id={`path-layer__${mapId}`}
                    />
                )}
                {scenegraphLayersData.map((layerData) => (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    <ScenegraphLayer
                        {...DEFAULT_LAYER_PROPS}
                        {...DEFAULT_SCENEGRAPH_LAYER_PROPS}
                        data={[layerData]}
                        id={`scenegraphLayer-${mapId}-${layerData.id}`}
                        scenegraph={layerData.url}
                    />
                ))}
                {(!isPreview || (isPreview && previewType === PreviewType.Robot)) && (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    <IconLayer
                        {...DEFAULT_LAYER_PROPS}
                        {...DEFAULT_ICON_LAYER_PROPS}
                        {...DEFAULT_ROBOT_LAYER_PROPS}
                        {...DEFAULT_ROBOT_ICON_LAYER_PROPS}
                        data={robotLayerData}
                        id={`robots-${mapId}-icon`}
                        getIcon={({ icon }: TRobotLayerData) => getLayerIcon(icon)}
                        onClick={handleRobotLayerClick}
                        updateTriggers={{ getIcon: [selectedRobotId] }}
                    />
                )}
                {(!isPreview || (isPreview && previewType === PreviewType.Robot)) && (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    <SimpleMeshLayer
                        {...DEFAULT_LAYER_PROPS}
                        {...DEFAULT_ROBOT_MESH_LAYER_PROPS}
                        {...DEFAULT_ROBOT_LAYER_PROPS}
                        data={robotLayerData}
                        id={`robots-${mapId}-mesh`}
                        getPosition={(d: TRobotLayerData) => [...d.position, 0]}
                        onClick={handleRobotLayerClick}
                        updateTriggers={{ getColor: [selectedRobotId] }}
                    />
                )}
            </DeckGL>
        </div>
    );
};

export default UserModeMap;
