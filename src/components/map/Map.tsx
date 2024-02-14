import React, { FC, KeyboardEvent, useCallback, useEffect, useMemo, useState } from 'react';
import DeckGL from '@deck.gl/react/typed';
import { ScenegraphLayer, SimpleMeshLayer } from '@deck.gl/mesh-layers/typed';
import { IconLayer, PathLayer } from '@deck.gl/layers/typed';
import { useDispatch, useSelector } from 'react-redux';
import { FlyToInterpolator, PickingInfo } from '@deck.gl/core/typed';
import { ViewStateChangeParameters } from '@deck.gl/core/typed/controllers/controller';
import { createDialog, DialogHandler, DialogType, ToastType } from 'chayns-api';
import clsx from 'clsx';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button, Tooltip } from 'chayns-components';
import { CONTROLLER_DEFAULTS, INITIAL_VIEW_STATE } from '../../constants/deckGl';
import { IIconData, mapRobotElementsToPathData } from '../../utils/dataHelper';
import { getModelsByMapId, getPathDataByMapId } from '../../constants/getMapData';
import {
    selectFollowRobot,
    selectInitialViewStateByMapId,
    selectSelectedRobotId
} from '../../redux-modules/map/selectors';
import { selectResetViewState } from '../../redux-modules/misc/selectors';
import { toggleSelectedDestination } from '../../redux-modules/misc/actions';
import { DragMode, PreviewType, TRobotLayerData, TUndoStackItem, TViewState } from '../../types/deckgl-map';
import { selectRobotEntities, selectRobotIds, selectSelectedRobot } from '../../redux-modules/robot-status/selectors';
import { changeSelectedMap, toggleFollowRobot, toggleSelectedRobot } from '../../redux-modules/map/actions';
import {
    coordinateToMeter,
    meterToCoordinate,
    robotAngleToViewStateBearing,
    svgToDataURL
} from '../../utils/conversionHelper';
import { getIconByDestinationType } from '../../utils/iconHelper';
import { RootState } from '../../redux-modules';
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
} from '../../constants/deckGlLayers';
import { ModelType } from '../../constants/hardcoded-data/models';
import {
    getRobotLayerData,
    selectDestinationsLayerData,
} from '../../redux-modules/layerDataSelectors';
import { TState } from '../../redux-modules/robot-status/slice';

const flyToInterpolator =  new FlyToInterpolator({
    speed: 10,
    maxDuration: 1000,
});

const Map: FC<{
    mapId: number,
    robotId?: string,
    isPreview?: boolean,
    previewType?: PreviewType,
    isEditor?: boolean,
    setFloorModels?: (floorModels: ModelType[]) => void,
    setViewState?: (viewState: TViewState) => void,
}> = ({
    mapId,
    robotId,
    isPreview = false,
    previewType = PreviewType.Robot,
    isEditor = false,
    setFloorModels: setFloorModelsProp = () => {},
    setViewState: setViewStateProp = () => {},
}) => {
    const dispatch = useDispatch();

    const [ctrlPressed, setCtrlPressed] = useState(false);
    const [shiftPressed, setShiftPressed] = useState(false);

    const [isDraggingMap, setIsDraggingMap] = useState(false);
    const [hoveringOver, setHoveringOver] = useState<string>();

    const [toastDialog, setToastDialog] = useState<DialogHandler>();


    // region Selectors

    // region other Selectors

    const initialViewState = useSelector(selectInitialViewStateByMapId(mapId));
    const resetViewState = useSelector(selectResetViewState);
    const [viewState, setViewState] = useState<TViewState>({
        ...INITIAL_VIEW_STATE,
        ...initialViewState,
    });

    const selectedRobotId = useSelector(selectSelectedRobotId);
    const selectedRobot = useSelector(selectSelectedRobot);

    const followRobot = useSelector(selectFollowRobot);

    // endregion

    // region LayerData

    const iconLayerData = useSelector((state: RootState) => selectDestinationsLayerData(state, mapId));
    const pathLayerData = useMemo(() => mapRobotElementsToPathData(
        getPathDataByMapId(mapId)?.elements || []
    ), [mapId]);



    // if (isPreview) {
    //     const previewMapRobot = state[robotStatusName].entities[previewMapRobotId || ''];
    //     return previewMapRobot && previewMapRobot.robotStatus?.currentMap?.id === mapId
    //         ? [getRobotLayerData(previewMapRobot)]
    //         : [];
    // }

    const robotIds = useSelector(selectRobotIds) as number[];
    const robotEntities = useSelector(selectRobotEntities);
    // const selectedRobotId = useSelector(selectSelectedRobotId);

    const robotsByMapId = useMemo(() => robotIds
        .filter((id) => robotEntities[id]?.robotStatus?.currentMap?.id === mapId)
        .map((id) => robotEntities[id]) as TState[], [mapId, robotEntities, robotIds]);

    const robotLayerData = useMemo(() => robotsByMapId
        .filter((data) => data?.puduRobotStatus)
        .map((data) => getRobotLayerData(data, selectedRobotId)), [robotsByMapId, selectedRobotId]);

    // const robotLayerData = useSelector((state: RootState) => selectRobotLayerData(state, {
    //     isPreview,
    //     previewMapRobotId: robotId,
    //     mapId,
    // }));

    const [floorModels, setFloorModels] = useState<ModelType[]>([]);

    // endregion

    // endregion

    // region Event Handlers

    const [undoStack, setUndoStack] = useState<TUndoStackItem[]>([]);
    const [redoStack, setRedoStack] = useState<TUndoStackItem[]>([]);

    // region Editor Drag Events

    const [draggingId, setDraggingId] = useState<string>('');
    const [dragOffset, setDragOffset] = useState<[number, number]>([0, 0]);
    const [previousRotation, setPreviousRotation] = useState(0);
    const [dragMode, setDragMode] = useState<DragMode | null>(null);

    const rotateModel = useCallback((info: PickingInfo, floorModel: ModelType) => {
        const meterCoordinate = coordinateToMeter(info.coordinate as [number, number]);

        const targetPosition = floorModel.position;
        const dragPosition = [
            meterCoordinate[0] - targetPosition[0],
            meterCoordinate[1] - targetPosition[1],
        ];

        const targetToDragOriginAngleDegree = Math.atan2(-dragOffset[1], -dragOffset[0]) * 180 / Math.PI + 180;
        const targetToDragPositionAngleDegree = Math.atan2(-dragPosition[1], -dragPosition[0]) * 180 / Math.PI + 180;

        setFloorModels((prev) => {
            const newFloorModels = [...prev];
            const targetModel = newFloorModels.find((m) => m.id === floorModel.id);
            if (targetModel){
                targetModel.orientation = [
                    targetModel.orientation[0],
                    previousRotation + (targetToDragPositionAngleDegree - targetToDragOriginAngleDegree),
                    targetModel.orientation[2]
                ];
            }
            return newFloorModels;
        });
        }, [dragOffset, previousRotation]);

    const translateModel = useCallback((info: PickingInfo, floorModel: ModelType) => {
        const meterCoordinate = coordinateToMeter(info.coordinate as [number, number]);

        setFloorModels((prev) => {
            const newFloorModels = [...prev];
            const targetModel = newFloorModels
                .find((m) => m.id === floorModel.id);
            if (targetModel){
                targetModel.position = [
                    meterCoordinate[0] - dragOffset[0],
                    meterCoordinate[1] - dragOffset[1],
                    targetModel.position[2]
                ];
            }
            return newFloorModels;
        });
    }, [dragOffset]);

    const onDragStart = useCallback((pickingInfo: PickingInfo) => {
        if (!isEditor) {
            return;
        }

        // Only start dragging if shift XOR ctrl were pressed.
        if ((ctrlPressed && !shiftPressed) || (!ctrlPressed && shiftPressed)) {
            const floorModel = pickingInfo.object as ModelType;

            // Saves the id of the element that is being dragged.
            setDraggingId(floorModel?.id || '');

            // Saves the position at which the cursor started dragging the element.
            const meterCoordinate = coordinateToMeter(pickingInfo.coordinate as [number, number]);
            setDragOffset([
                meterCoordinate[0] - floorModel.position[0],
                meterCoordinate[1] - floorModel.position[1]]
            );

            // Saves the rotation of the element before dragging.
            setPreviousRotation(floorModel.orientation[1]);

            // Sets the drag mode to translate or rotate depending on whether ctrl or shift was pressed.
            if (ctrlPressed) {
                setDragMode(DragMode.translate);
            } else if (shiftPressed) {
                setDragMode(DragMode.rotate);
            }

            // Adds the position and rotation of the element to the undo stack.
            setUndoStack((prev) => [
                ...prev, {
                    id: floorModel.id,
                    position: floorModel.position,
                    orientation: floorModel.orientation,
                }
            ]);
            setRedoStack([]);
        }
    }, [ctrlPressed, isEditor, shiftPressed]);

    const onDrag = useCallback((pickingInfo: PickingInfo) => {
        if (!isEditor) {
            return;
        }

        const floorModel = pickingInfo.object as ModelType;
        if (draggingId === floorModel.id) {
            switch (dragMode) {
                case DragMode.translate:
                    translateModel(pickingInfo, floorModel);
                    break;
                case DragMode.rotate:
                    rotateModel(pickingInfo, floorModel);
                    break;
                default:
            }
        }
    }, [dragMode, draggingId, isEditor, rotateModel, translateModel]);

    const onDragEnd = useCallback(() => {
        if (!isEditor) {
            return;
        }

        // Resets various states, that were needed while the element was dragged.
        setDraggingId('');
        setDragOffset([0, 0]);
        setDragMode(null);
        setPreviousRotation(0);
    }, [isEditor]);

    // endregion

    // region Key Down/Up Events

    const undo = () => {
        const undoAction = undoStack[undoStack.length - 1];
        if (undoAction) {
            const redoStackItem = {
                id: undoAction.id,
                orientation: [0, 0, 0] as [number, number, number],
                position: [0, 0, 0] as [number, number, number],
            };

            setFloorModels((prev) => {
                const newFloorModels = [...prev];
                const targetModel = newFloorModels.find((m) => m.id === undoAction.id);
                if (targetModel){
                    redoStackItem.orientation = targetModel.orientation;
                    redoStackItem.position = targetModel.position;
                    targetModel.orientation = undoAction.orientation;
                    targetModel.position = undoAction.position;
                }
                return newFloorModels;
            });

            setUndoStack((prev) => prev.slice(0, -1))
            setRedoStack((prev) => [...prev, redoStackItem]);
        }
    }

    const redo = () => {
        const redoAction = redoStack[redoStack.length - 1];
        if (redoAction) {
            const undoStackItem = {
                id: redoAction.id,
                orientation: [0, 0, 0] as [number, number, number],
                position: [0, 0, 0] as [number, number, number],
            };

            setFloorModels((prev) => {
                const newFloorModels = [...prev];
                const targetModel = newFloorModels.find((m) => m.id === redoAction.id);
                if (targetModel){
                    undoStackItem.orientation = targetModel.orientation;
                    undoStackItem.position = targetModel.position;
                    targetModel.orientation = redoAction.orientation;
                    targetModel.position = redoAction.position;
                }
                return newFloorModels;
            });

            setRedoStack((prev) => prev.slice(0, -1))
            setUndoStack((prev) => [...prev, undoStackItem]);
        }
    }

    const onKeyDown = (event: KeyboardEvent) => {
        setCtrlPressed(event.ctrlKey);
        setShiftPressed(event.shiftKey);

        // Undo on CTRL+Z
        if (event.keyCode === 90 && event.ctrlKey) {
            undo();
        }

        // Redo on CTRL+Y
        if (event.keyCode === 89 && event.ctrlKey) {
            redo();
        }
    }

    const onKeyUp = (event: KeyboardEvent) => {
        setCtrlPressed(event.ctrlKey);
        setShiftPressed(event.shiftKey);
    }

    // endregion

    // region Other Event Handlers
    
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
                style: {
                    backgroundColor: 'rgb(var(--chayns-bg-rgb))',
                    color: 'var(--chayns-color--text)',
                },
                html: `<h3 style='margin-top: 0'>${iconData.name}</h3>
                    ${iconData.customType ? `<p>${iconData.customType}</p>` : ''}`
            };
        }

        if (pickingInfo?.layer?.id?.startsWith('robots') && pickingInfo?.object) {
            const robotData = pickingInfo.object as TRobotLayerData;
            return {
                style: {
                    backgroundColor: 'rgb(var(--chayns-bg-rgb))',
                    color: 'var(--chayns-color--text)',
                },
                html: `<h3 style='margin-top: 0'>${robotData.name}</h3>`
            };
        }

        return null;
    };

    // endregion

    // region Updates

    // region Update Parent State

    useEffect(() => {
        setFloorModelsProp(floorModels);
    }, [floorModels, setFloorModelsProp]);

    useEffect(() => {
        setViewStateProp(viewState);
    }, [setViewStateProp, viewState]);

    // endregion

    useEffect(() => {
        if (isEditor && !toastDialog) {
            const dialog = createDialog({
                type: DialogType.TOAST,
                permanent: true,
                toastType: ToastType.NEUTRAL,
                text: 'Drücke STRG um die Modelle mit der Maus zu verschieben und SHIFT um die Modelle mit der Maus zu rotieren.',
                showCloseIcon: true,
            })
            void dialog.open();
            setToastDialog(dialog);
        }
    }, [isEditor, toastDialog]);

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

    return (
        <div
            onContextMenu={(event) => event.preventDefault()}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
        >
            <DeckGL
                viewState={viewState}
                controller={isEditor && draggingId
                    ? false
                    : CONTROLLER_DEFAULTS}
                onViewStateChange={handleNewViewState}
                getTooltip={getTooltip}
                onDragStart={() => setIsDraggingMap(true)}
                onDragEnd={() => setIsDraggingMap(false)}
                onHover={(a) => {
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
                        onDrag={onDrag}
                        onDragEnd={onDragEnd}
                        onDragStart={onDragStart}
                        opacity={(
                            (
                                ((!shiftPressed && ctrlPressed) || (shiftPressed && !ctrlPressed))
                                && hoveringOver === `scenegraphLayer-${mapId}-${layerData.id}`
                            )
                            || (draggingId && draggingId === layerData.id)
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
                        updateTriggers={{
                            getPosition: robotLayerData,
                            getOrientation: robotLayerData,
                        }}
                    />
                )}
            </DeckGL>
            {isEditor && (
                <div style={{ zIndex: 100, position: 'absolute', top: '10px', left: '10px', display: 'flex' }}>
                    <Tooltip
                        bindListeners
                        content={{ text: 'Rückgängig (STRG + Z)' }}
                    >
                        <Button
                            disabled={undoStack.length === 0}
                            className={clsx('icon-button pointer-events', {
                                'button--secondary': !followRobot,
                            })}
                            onClick={() => undo()}
                        >
                            <i className="far fa-undo"/>
                        </Button>
                    </Tooltip>
                    <div style={{ width: '10px' }}/>
                    <Tooltip
                        bindListeners
                        content={{ text: 'Wiederholen (STRG + Y)' }}
                    >
                        <Button
                            disabled={redoStack.length === 0}
                            className={clsx('icon-button pointer-events', {
                                'button--secondary': !followRobot,
                            })}
                            onClick={() => redo()}
                        >
                            <i className="far fa-redo"/>
                        </Button>
                    </Tooltip>
                </div>
            )}
        </div>
    );
};

export default Map;
