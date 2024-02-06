/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
// @ts-ignore
import { Button } from 'chayns-components';
import DeckGL from '@deck.gl/react/typed';
import ViewState from '@deck.gl/core/typed/controllers/view-state';
import { ScenegraphLayer } from '@deck.gl/mesh-layers/typed';
import { PickingInfo } from '@deck.gl/core/typed';
import { IconLayer, PathLayer } from '@deck.gl/layers/typed';
import { useDispatch, useSelector } from 'react-redux';
import { demoPolygonLayer } from '../../../constants/layers';
import { coordinateToMeter } from '../../../utils/deckGlHelpers';
import {
    getIconDataFromDestinations,
    mapRobotElementsToPathData
} from '../../../utils/dataHelper';
import { TMapElement } from '../../../types/pudu-api/robotMap';
import { ChaynsViewMode, removeFooter, updateChaynsViewmode } from '../../../utils/pageSizeHelper';
import { iconLayerDefaults, INITIAL_VIEW_STATE, pathLayerDefaults, scenegraphLayerDefaults } from '../../../constants/deckGl';
import { getModelsByMapId, getPathDataByMapId } from '../../../constants/puduData';
import { ModelType } from '../../../constants/models';
import { changeAdminModeType } from '../../../redux-modules/misc/actions';
import { AdminModeType } from '../../../types/misc';
import { selectInitialViewStateByMapId } from '../../../redux-modules/map/selectors';
import { changeInitialViewState } from '../../../redux-modules/map/actions';
import { selectDestinationEntities, selectDestinationIdsByMapId } from '../../../redux-modules/destination/selectors';

type TGltfModel = {
    id: string,
    url: string,
    position: [number, number, number],
    orientation: [number, number, number],
}

enum EDragMode {
    translate = 'translate',
    rotate = 'rotate',
}

type TUndoStackItem = {
    id: string,
    position: [number, number, number],
    orientation: [number, number, number],
}

type TMap = {
    elements: TMapElement[],
}

const EditorMap: FC<{
    mapId: number,
}> = ({
    mapId,
}) => {
    const dispatch = useDispatch();

    const initialViewState = useSelector(selectInitialViewStateByMapId(mapId));
    const [viewState, setViewState] = useState<ViewState<any, any, any>>({
        ...INITIAL_VIEW_STATE,
        ...initialViewState,
    });

    const [isDraggingMap, setIsDraggingMap] = useState(false);
    const [hoveringOver, setHoveringOver] = useState<string>();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    const [gltfModels, setGltfModels] = useState<ModelType[]>([]);

    const [draggingId, setDraggingId] = useState<string>('');
    // Offset between position of dragging cursor on model in relation to the models center.
    const [dragOffset, setDragOffset] = useState<[number, number]>([0, 0]);
    const [dragMode, setDragMode] = useState<EDragMode | null>(null);
    const [ctrlPressed, setCtrlPressed] = useState(false);
    const [shiftPressed, setShiftPressed] = useState(false);
    const [previousRotation, setPreviousRotation] = useState(0);

    const [undoStack, setUndoStack] = useState<TUndoStackItem[]>([]);
    const [redoStack, setRedoStack] = useState<TUndoStackItem[]>([]);

    const [hasChanged, setHasChanged] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    const pathData = useMemo(() => mapRobotElementsToPathData(getPathDataByMapId(mapId).elements), [mapId]);
    const pathLayer = useMemo<PathLayer>(() => new PathLayer({
        ...pathLayerDefaults,
        pickable: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
        data: pathData,
    }), [pathData]);

    const destinationIds = useSelector(selectDestinationIdsByMapId(mapId));
    const destinationEntities = useSelector(selectDestinationEntities);
    const destinations = useMemo(() => destinationIds?.map((id) => destinationEntities[id]) || [],
        [destinationIds, destinationEntities]);

    const iconLayerData = useMemo(() => getIconDataFromDestinations(destinations),
        [destinations]);
    const iconLayer = useMemo<IconLayer>(() => new IconLayer({
        ...iconLayerDefaults,
        pickable: false,
        data: iconLayerData,
    }), [iconLayerData]);

    const rotateModel = useCallback((info: PickingInfo, gltfModel: TGltfModel) => {
        const meterCoordinate = coordinateToMeter(info.coordinate as [number, number]);

        const targetPosition = gltfModel.position;
        const dragPosition = [
            meterCoordinate[0] - targetPosition[0],
            meterCoordinate[1] - targetPosition[1],
        ];

        const targetToDragOriginAngleDegree = Math.atan2(-dragOffset[1], -dragOffset[0]) * 180 / Math.PI + 180;
        const targetToDragPositionAngleDegree = Math.atan2(-dragPosition[1], -dragPosition[0]) * 180 / Math.PI + 180;

        setGltfModels((prev) => {
            const newGltfModels = [...prev];
            const targetModel = newGltfModels.find((m) => m.id === gltfModel.id);
            if (targetModel){
                targetModel.orientation = [
                    targetModel.orientation[0],
                    previousRotation + (targetToDragPositionAngleDegree - targetToDragOriginAngleDegree),
                    targetModel.orientation[2]
                ];
            }
            return newGltfModels;
        });

        setHasChanged((prev) => !prev);
    }, [dragOffset, previousRotation]);

    const translateModel = useCallback((info: PickingInfo, gltfModel: TGltfModel) => {
        const meterCoordinate = coordinateToMeter(info.coordinate as [number, number]);

        setGltfModels((prev) => {
            const newGltfModels = [...prev];
            const targetModel = newGltfModels.find((m) => m.id === gltfModel.id);
            if (targetModel){
                targetModel.position = [
                    meterCoordinate[0] - dragOffset[0],
                    meterCoordinate[1] - dragOffset[1],
                    targetModel.position[2]
                ];
            }
            return newGltfModels;
        });

        setHasChanged((prev) => !prev);
    }, [dragOffset]);

    const scenegraphLayers = useMemo<ScenegraphLayer[]>(() => gltfModels.map((gltfModel) => new ScenegraphLayer({
        ...scenegraphLayerDefaults,
        id: gltfModel.id,
        data: [{
            position: gltfModel.position,
            orientation: gltfModel.orientation,
        }],
        opacity: (((!shiftPressed && ctrlPressed) || (shiftPressed && !ctrlPressed)) && hoveringOver === gltfModel.id) || (draggingId && draggingId === gltfModel.id)
            ? 0.75
            : 1,
        scenegraph: gltfModel.url,
        getPosition: (m: TGltfModel) => m.position,
        getOrientation: (m: TGltfModel) => m.orientation,
        onDragStart: (pickingInfo) => {
            // Only start dragging if shift XOR ctrl were pressed.
            if ((ctrlPressed && !shiftPressed) || (!ctrlPressed && shiftPressed)) {
                // Saves the id of the element that is being dragged.
                setDraggingId(pickingInfo.layer?.id || '');

                // Saves the position at which the cursor started dragging the element.
                const meterCoordinate = coordinateToMeter(pickingInfo.coordinate as [number, number]);
                setDragOffset([
                    meterCoordinate[0] - gltfModel.position[0],
                    meterCoordinate[1] - gltfModel.position[1]]
                );

                // Saves the rotation of the element before dragging.
                setPreviousRotation(gltfModel.orientation[1]);

                // Sets the drag mode to translate or rotate depending on whether ctrl or shift was pressed.
                if (ctrlPressed) {
                    setDragMode(EDragMode.translate);
                } else if (shiftPressed) {
                    setDragMode(EDragMode.rotate);
                }

                // Adds the position and rotation of the element to the undo stack.
                setUndoStack((prev) => [
                    ...prev, {
                        id: gltfModel.id,
                        position: gltfModel.position,
                        orientation: gltfModel.orientation,
                    }
                ]);
                setRedoStack([]);
            }
        },
        onDrag: (pickingInfo) => {
            if (draggingId === gltfModel.id) {
                switch (dragMode) {
                    case EDragMode.translate:
                        translateModel(pickingInfo, gltfModel);
                        break;
                    case EDragMode.rotate:
                        rotateModel(pickingInfo, gltfModel);
                        break;
                    default:
                }
            }
        },
        onDragEnd: () => {
            // Resets various states, that were needed while the element was dragged.
            setDraggingId('');
            setDragOffset([0, 0]);
            setDragMode(null);
            setPreviousRotation(0);
        },
        updateTriggers: {
            // TODO Only update dragged model
            getPosition: [hasChanged]
        }
    })), [gltfModels, hasChanged, draggingId, dragMode, ctrlPressed, shiftPressed, rotateModel, translateModel, hoveringOver]);

    useEffect(() => {
        updateChaynsViewmode(ChaynsViewMode.wide);
        removeFooter(true);
        setGltfModels(getModelsByMapId(mapId));
    }, [mapId]);

    return (
        <div
            className="deckGlWrapper"
            onContextMenu={(event) => event.preventDefault()}
            onKeyDown={(event) => {
                setCtrlPressed(event.ctrlKey);
                setShiftPressed(event.shiftKey);

                if (event.keyCode === 90 && event.ctrlKey) {
                    const undoAction = undoStack[undoStack.length - 1];
                    if (undoAction) {
                        const redoStackItem = {
                            id: undoAction.id,
                            orientation: [0, 0, 0] as [number, number, number],
                            position: [0, 0, 0] as [number, number, number],
                        };

                        setGltfModels((prev) => {
                            const newGltfModels = [...prev];
                            const targetModel = newGltfModels.find((m) => m.id === undoAction.id);
                            if (targetModel){
                                redoStackItem.orientation = targetModel.orientation;
                                redoStackItem.position = targetModel.position;
                                targetModel.orientation = undoAction.orientation;
                                targetModel.position = undoAction.position;
                            }
                            return newGltfModels;
                        });

                        setUndoStack((prev) => prev.slice(0, -1))
                        setRedoStack((prev) => [...prev, redoStackItem]);
                    }
                }

                if (event.keyCode === 89 && event.ctrlKey) {
                    const redoAction = redoStack[redoStack.length - 1];
                    if (redoAction) {
                        const undoStackItem = {
                            id: redoAction.id,
                            orientation: [0, 0, 0] as [number, number, number],
                            position: [0, 0, 0] as [number, number, number],
                        };

                        setGltfModels((prev) => {
                            const newGltfModels = [...prev];
                            const targetModel = newGltfModels.find((m) => m.id === redoAction.id);
                            if (targetModel){
                                undoStackItem.orientation = targetModel.orientation;
                                undoStackItem.position = targetModel.position;
                                targetModel.orientation = redoAction.orientation;
                                targetModel.position = redoAction.position;
                            }
                            return newGltfModels;
                        });

                        setRedoStack((prev) => prev.slice(0, -1))
                        setUndoStack((prev) => [...prev, undoStackItem]);
                    }
                }
            }}
            onKeyUp={(event) => {
                setCtrlPressed(event.ctrlKey);
                setShiftPressed(event.shiftKey);
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
                className="map-buttons"
            >
                <Button
                    className="icon-button button--secondary"
                    onClick={() => {
                        let input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.glb';
                        input.onchange = _ => {
                            // you can use this method to get file and perform respective operations
                            let files =   Array.from(input.files);
                            console.log(files);
                            // TODO Upload to chayns Space.
                        };
                        input.click();
                    }}
                >
                    <i className="fa fa-file-arrow-up"></i>
                </Button>
                <Button
                    className="icon-button button--secondary"
                    onClick={() => setViewState((prev) => ({
                        ...prev,
                        ...initialViewState,
                    }))}
                >
                    <i className="fa fa-location-crosshairs"/>
                </Button>
                <Button
                    className="icon-button button--secondary"
                    onClick={() => {
                        const newInitialViewState = {
                            bearing: viewState.bearing,
                            latitude: viewState.latitude,
                            longitude: viewState.longitude,
                            pitch: viewState.pitch,
                            zoom: viewState.zoom,
                        };
                        console.log('newInitialViewState', newInitialViewState);
                        dispatch(changeInitialViewState({
                            mapId,
                            viewState: newInitialViewState,
                        }))
                    }}
                >
                    <i className="fa fa-crosshairs-simple"/>
                </Button>
            </div>
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'row',
                    zIndex: 2,
                }}
            >
                <div style={{ padding: '10px' }}>
                    <Button
                        onClick={() => {
                            console.log('Models', gltfModels)
                            dispatch(changeAdminModeType({ adminModeType: AdminModeType.default }))
                        }}
                    >
                        Speichern
                    </Button>
                </div>
                <div style={{ padding: '10px' }}>
                    <Button
                        onClick={() => dispatch(changeAdminModeType({ adminModeType: AdminModeType.default }))}
                    >
                        Abbrechen
                    </Button>
                </div>

            </div>
            <DeckGL
                viewState={viewState}
                layers={[
                    ...scenegraphLayers,
                    demoPolygonLayer,
                    pathLayer,
                    iconLayer,
                ]}
                controller={!draggingId}
                onViewStateChange={({ viewState: newViewState }) => setViewState(newViewState as ViewState<any, any, any>)}
                getCursor={() => dragMode || isDraggingMap
                    ? 'grabbing'
                    : hoveringOver && (shiftPressed || ctrlPressed)
                        ? 'pointer'
                        : 'grab'}
                onDragStart={() => setIsDraggingMap(true)}
                onDragEnd={() => setIsDraggingMap(false)}
                onHover={(a, b) => {
                    if (a.layer) {
                        setHoveringOver(a.layer.id);
                    } else {
                        setHoveringOver(undefined);
                    }
                }}
            />
        </div>

    );
};

export default EditorMap;
