/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { FC, useMemo, useState } from 'react';
import DeckGL from '@deck.gl/react/typed';
import ViewState from '@deck.gl/core/typed/controllers/view-state';
import { ScenegraphLayer, ScenegraphLayerProps } from '@deck.gl/mesh-layers/typed';
import { COORDINATE_SYSTEM, PickingInfo } from '@deck.gl/core/typed';
import { IconLayer, PathLayer } from '@deck.gl/layers/typed';
import { demoPolygonLayer } from '../constants/layers';
import { coordinateToMeter } from '../utils/deckGlHelpers';
import { mapRobotElementsToIconData, mapRobotElementsToPathData } from '../utils/dataHelper';
import { TMapElement } from '../types/pudu-api/robotMap';
import { svgToDataURL } from '../utils/marker';
import { blueMarker } from '../assets/markers';
import { IIconData } from '../types/deckgl-map';

const scenegraphLayerDefaults: Partial<ScenegraphLayerProps> = {
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    parameters: { cull: true },
    pickable: true,
    sizeScale: 1,
    _lighting: 'pbr',
}

const pathLayerDefaults: Partial<PathLayer> = {
    id: 'path-layer-track',
    // @ts-ignore
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    pickable: true,
    widthScale: 0.05,
    getWidth: 1,
    widthMinPixels: 2,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    getColor: (d: { color: [number, number, number] }) => d.color || [0, 0, 0],
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
    // @ts-ignore
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

type TMap = {
    elements: TMapElement[],
}

const EditorMap: FC<{
    gltfModelsProp: TGltfModel[],
    map: TMap,
}> = ({
    gltfModelsProp,
    map,
}) => {
    const [viewState, setViewState] = useState<ViewState<any, any, any>>(INITIAL_VIEW_STATE);

    const [gltfModels, setGltfModels] = useState<TGltfModel[]>(gltfModelsProp);

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

    const pathData = useMemo(() => mapRobotElementsToPathData(map.elements), [map]);
    const pathLayer = useMemo<PathLayer>(() => new PathLayer({
        ...pathLayerDefaults,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
        data: pathData,
    }), [pathData]);

    const iconData = useMemo(() => mapRobotElementsToIconData(map.elements), [map]);
    const iconLayer = useMemo<IconLayer>(() => new IconLayer({
        id: 'icon-layer',
        coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
        pickable: true,
        data: iconData,
        sizeScale: 3,
        getSize: 1,
        sizeUnits: 'meters',
        getPosition: (d: IIconData) => [d.position[0], d.position[1], 0.5],
        getIcon: () => ({
            url: svgToDataURL(blueMarker()),
            height: 128,
            width: 128,
        }),
        getColor: (d: IIconData) => d.color || [0, 0, 0],
    }), [iconData])

    const scenegraphLayers = useMemo<ScenegraphLayer[]>(() => gltfModels.map((gltfModel) => new ScenegraphLayer({
        ...scenegraphLayerDefaults,
        id: gltfModel.id,
        data: [{
            position: gltfModel.position,
            orientation: gltfModel.orientation,
        }],
        opacity: (shiftPressed || ctrlPressed) && ((draggingId && draggingId === gltfModel.id) || !draggingId)
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
                    previousRotation + (targetToDragPositionAngleDegree - targetToDragOriginAngleDegree),
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
                    iconLayer,
                ]}
                controller={!draggingId}
                onViewStateChange={({ viewState: newViewState }) => setViewState(newViewState)}
            />
        </div>

    );
};

export default EditorMap;
