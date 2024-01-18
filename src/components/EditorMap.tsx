import React, { FC, useEffect, useMemo, useState } from 'react';
import DeckGL from '@deck.gl/react/typed';
import ViewState from '@deck.gl/core/typed/controllers/view-state';
import { ScenegraphLayer, ScenegraphLayerProps } from '@deck.gl/mesh-layers/typed';
import { COORDINATE_SYSTEM, PickingInfo } from '@deck.gl/core/typed';
import { demoPolygonLayer } from '../constants/layers';
import { coordinateToMeter } from '../utils/deckGlHelpers';
import { PathLayer } from '@deck.gl/layers/typed';
import { mapRobotElementsToPathData } from '../utils/dataHelper';
import { number } from 'prop-types';
import { Simulate } from 'react-dom/test-utils';
import keyDown = Simulate.keyDown;

const scenegraphLayerDefaults: Partial<ScenegraphLayerProps> = {
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    parameters: { cull: true },
    pickable: true,
    sizeScale: 1,
    _lighting: 'pbr',
}

type TGltfModel = {
    id: string,
    url: string,
    position: [number, number, number],
    orientation: [number, number, number],
}

enum EDragMode {
    translate,
    rotate,
}

const INITIAL_VIEW_STATE: ViewState<any, any, any> = {
    longitude: 0,
    latitude: 0,
    zoom: 21,
    maxZoom: 25,
    minZoom: 19,
    pitch: 0,
    bearing: 0,
    rotationX: 20,
};

type TUndoStackItem = {
    id: string,
    position: [number, number, number],
    orientation: [number, number, number],
}

const EditorMap: FC<{
    gltfModelsProp: TGltfModel[],
    pathData: any,
}> = ({
    gltfModelsProp,
    pathData,
}) => {
    const [viewState, setViewState] = useState<ViewState<any, any, any>>(INITIAL_VIEW_STATE);

    const [gltfModels, setGltfModels] = useState<TGltfModel[]>(gltfModelsProp);
    const [draggingId, setDraggingId] = useState<string>('');
    // Offset between position of dragging cursor on model in relation to the models center.
    const [dragOffset, setDragOffset] = useState<[number, number]>([0, 0]);
    const [dragMode, setDragMode] = useState<EDragMode | null>(null);
    const [ctrlPressed, setCtrlPressed] = useState(false);
    const [shiftPressed, setShiftPressed] = useState(false);

    const [undoStack, setUndoStack] = useState<TUndoStackItem[]>([]);
    const [redoStack, setRedoStack] = useState<TUndoStackItem[]>([]);

    const [hasChanged, setHasChanged] = useState(false);

    const pathLayer = useMemo<PathLayer>(() => new PathLayer({
        id: 'path-layer-track',
        coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
        pickable: true,
        data: mapRobotElementsToPathData(pathData.elements),
        widthScale: 0.05,
        getWidth: 1,
        widthMinPixels: 2,
        positionFormat: `XY`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
        getColor: (d) => d.color || [0, 0, 0],
        onHover: () => console.log('Hover'),
    }), [pathData])

    useEffect(() => {
        console.log('undoStack', [...undoStack]);
    }, [undoStack]);
    useEffect(() => {
        console.log('redoStack', [...redoStack]);
    }, [redoStack]);

    const scenegraphLayers = useMemo<ScenegraphLayer[]>(() => gltfModels.map((gltfModel) => new ScenegraphLayer({
        ...scenegraphLayerDefaults,
        id: gltfModel.id,
        data: [{
            position: gltfModel.position,
            orientation: gltfModel.orientation,
        }],
        scenegraph: gltfModel.url,
        getPosition: (m: TGltfModel) => m.position,
        getOrientation: (m: TGltfModel) => m.orientation,
        onDragStart: (info) => {
            if ((ctrlPressed && !shiftPressed) || (!ctrlPressed && shiftPressed)) {
                setDraggingId(info.layer?.id || '');

                const meterCoordinate = coordinateToMeter(info.coordinate as [number, number]);
                setDragOffset([
                    meterCoordinate[0] - gltfModel.position[0],
                    meterCoordinate[1] - gltfModel.position[1]]
                );

                if (ctrlPressed) {
                    setDragMode(EDragMode.translate);
                } else if (shiftPressed) {
                    setDragMode(EDragMode.rotate);
                }

                setUndoStack((prev) => [
                    ...prev, {
                        id: gltfModel.id,
                        position: gltfModel.position,
                        orientation: gltfModel.orientation,
                    }
                ]);
                setRedoStack([]);
            }

            // TODO Add undo and redo.
        },
        onDrag: (i, e) => {
            // console.log('onDrag', i);
            // console.log('coordinate', i.coordinate);
            if (draggingId === gltfModel.id) {
                switch (dragMode) {
                    case EDragMode.translate:
                        translateModel(i, gltfModel);
                        break;
                    case EDragMode.rotate:
                        rotateModel(i, gltfModel);
                        break;
                    default:
                }
            }
        },
        onDragEnd: () => {
            setDraggingId('');
            setDragOffset([0, 0]);
            setDragMode(null);
        },
        updateTriggers: {
            // TODO Only update dragged model
            getPosition: [hasChanged]
        }
    })), [gltfModels, hasChanged, draggingId, dragMode, ctrlPressed, shiftPressed]);

    const rotateModel = (info: PickingInfo, gltfModel: TGltfModel) => {
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
                    targetModel.orientation[0] + (targetToDragPositionAngleDegree - targetToDragOriginAngleDegree),
                    targetModel.orientation[2]
                ];
            }
            return newGltfModels;
        });

        setHasChanged((prev) => !prev);
    }

    const translateModel = (info: PickingInfo, gltfModel: TGltfModel) => {
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
    }

    return (
        <div
            onKeyDown={(event) => {
                setCtrlPressed(event.ctrlKey);
                setShiftPressed(event.shiftKey);

                if (event.keyCode === 90 && event.ctrlKey) {
                    const undoAction = undoStack[undoStack.length - 1];
                    console.log('undoStack', [...undoStack]);
                    console.log('undoAction', undoAction);
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
            <DeckGL
                viewState={viewState}
                layers={[
                    ...scenegraphLayers,
                    demoPolygonLayer,
                    pathLayer,
                ]}
                controller={!draggingId}
                onViewStateChange={({ viewState: newViewState }) => setViewState(newViewState)}
            />
        </div>

    );
};

export default EditorMap;
