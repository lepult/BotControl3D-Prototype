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
import { ModelType } from '../../../constants/models';

const flyToInterpolator =  new FlyToInterpolator({
    speed: 10,
    maxDuration: 1000,
});

const UserModeMap: FC<{
    mapId: number,
    robotId?: string,
    isPreview?: boolean,
    previewType?: PreviewType,
    isEditor?: boolean,
}> = ({
    mapId,
    robotId,
    isPreview = false,
    previewType = PreviewType.Robot,
    isEditor = false,
}) => {
    const dispatch = useDispatch();

    const [ctrlPressed, setCtrlPressed] = useState(false);
    const [shiftPressed, setShiftPressed] = useState(false);

    const [isDraggingMap, setIsDraggingMap] = useState(false);
    const [hoveringOver, setHoveringOver] = useState<string>();

    // region Selectors

    const initialViewState = useSelector(selectInitialViewStateByMapId(mapId));
    const resetViewState = useSelector(selectResetViewState);
    const [viewState, setViewState] = useState<TViewState>({
        ...INITIAL_VIEW_STATE,
        ...initialViewState,
    });

    const selectedRobotId = useSelector(selectSelectedRobotId);
    const selectedRobot = useSelector(selectSelectedRobot);

    const followRobot = useSelector(selectFollowRobot);

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
    const [floorModels, setFloorModels] = useState<ModelType[]>([]);

    // endregion

    // endregion

    // region Updates

    useEffect(() => {
        setFloorModels(getModelsByMapId(mapId));
    }, [mapId]);

    // Resets the ViewState E.g. if the corresponding Button is clicked.
    useEffect(() => {
        setViewState((prev) => ({
            ...prev,
            ...initialViewState,
            zoom: isPreview ? initialViewState.zoom - 2 : initialViewState.zoom,
        }));
    }, [initialViewState, resetViewState, isPreview]);

    // Sets the transitionDuration and -Interpolator, when followRobot changes.
    useEffect(() => {
        setViewState((prev) => ({
            ...prev,
            transitionDuration: followRobot ? 2000 : 0,
            transitionInterpolator: followRobot ? flyToInterpolator : undefined,
        }))
    }, [followRobot]);

    // I forgot what this does. TODO Find out!
    useEffect(() => {
        if (!selectedRobotId && robotId && isPreview) {
            dispatch(toggleSelectedRobot({ robotId }));
        }
    }, [dispatch, robotId, isPreview, selectedRobotId]);

    // Makes the ViewState follow the selected Robot automatically, when followRobot is true.
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

    // endregion

    // region Event Handlers

    const handleNewViewState = useCallback((viewStateChagneParameters: ViewStateChangeParameters) => {
        // Stop following the Robot automatically, if User moved the View by interacting with the Map.
        const interaction = viewStateChagneParameters.interactionState;
        if (followRobot && (interaction.isDragging || interaction.isPanning || interaction.isZooming || interaction.isRotating)) {
            dispatch(toggleFollowRobot());
        }

        // Updates the ViewState.
        setViewState((prev) => ({
            ...prev,
            ...viewStateChagneParameters.viewState,
        }));
    }, [dispatch, followRobot]);

    const handleRobotLayerClick = useCallback((pickingInfo: PickingInfo) => {
        if (isPreview || isEditor) return;
        dispatch(toggleSelectedRobot({
            robotId: (pickingInfo.object as TRobotLayerData).robotId
        }));
    }, [dispatch, isPreview, isEditor]);

    // endregion

    // region Data Accessors

    const getCursor = useCallback(() => {
        // TODO Display correct cursors for userMap (e.g. pointer on hover over icon)
        if (isDraggingMap) {
            return 'grabbing';
        }
        if (isEditor) {
            if (hoveringOver && hoveringOver.startsWith('scenegraphLayer') && (shiftPressed || ctrlPressed)) {
                return 'pointer';
            }
            return 'grab';
        }
        return hoveringOver ? 'pointer' : 'grab';
    }, [isEditor, isDraggingMap, shiftPressed, ctrlPressed, hoveringOver]);

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

    // endregion

    return (
        <div
            onContextMenu={(event) => event.preventDefault()}
            onKeyDown={(event) => {
                setCtrlPressed(event.ctrlKey);
                setShiftPressed(event.shiftKey);
            }}
            onKeyUp={(event) => {
                setCtrlPressed(event.ctrlKey);
                setShiftPressed(event.shiftKey);
            }}
        >
            <DeckGL
                viewState={viewState}
                controller={CONTROLLER_DEFAULTS}
                onViewStateChange={handleNewViewState}
                getTooltip={getTooltip}
                onDragStart={() => setIsDraggingMap(true)}
                onDragEnd={() => setIsDraggingMap(false)}
                onHover={(a, b) => {
                    if (a.layer) {
                        setHoveringOver(a.layer.id);
                    } else {
                        setHoveringOver(undefined);
                    }
                }}
                getCursor={getCursor}
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
                            if (iconData.invalid || isEditor) {
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
                        pickable={!isEditor}
                    />
                )}
                {floorModels.map((layerData) => (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    <ScenegraphLayer
                        {...DEFAULT_LAYER_PROPS}
                        {...DEFAULT_SCENEGRAPH_LAYER_PROPS}
                        data={[layerData]}
                        id={`scenegraphLayer-${mapId}-${layerData.id}`}
                        opacity={(
                            (
                                ((!shiftPressed && ctrlPressed) || (shiftPressed && !ctrlPressed))
                                && hoveringOver === `scenegraphLayer-${mapId}-${layerData.id}`
                            )
                            /*|| (draggingId && draggingId === gltfModel.id)*/
                        ) ? 0.75 : 1}
                        pickable={isEditor}
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
