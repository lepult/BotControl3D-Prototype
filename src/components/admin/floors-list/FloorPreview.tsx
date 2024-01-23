/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { FC, useEffect, useMemo, useState } from 'react';
import ViewState from '@deck.gl/core/typed/controllers/view-state';
import DeckGL from '@deck.gl/react/typed';
import { ScenegraphLayer } from '@deck.gl/mesh-layers/typed';
import { IconLayer, PathLayer } from '@deck.gl/layers/typed';
import { useDispatch, useSelector } from 'react-redux';
// @ts-ignore
import { SmallWaitCursor, Button } from 'chayns-components';
import {
    iconLayerDefaults,
    INITIAL_VIEW_STATE,
    pathLayerDefaults,
    scenegraphLayerDefaults
} from '../../../constants/deckGl';
import { mapRobotElementsToIconData, mapRobotElementsToPathData } from '../../../utils/dataHelper';
import { TMapElement } from '../../../types/pudu-api/robotMap';
import { getModelsByMapId, getPathDataByMapId } from '../../../constants/puduData';
import { selectInitialViewStateByMapId } from '../../../redux-modules/map/selectors';
import { selectSelectedDestination } from '../../../redux-modules/misc/selectors';
import { meterToCoordinate } from '../../../utils/deckGlHelpers';
import { changeSelectedDestination } from '../../../redux-modules/misc/actions';

type TGltfModel = {
    id: string,
    url: string,
    position: [number, number, number],
    orientation: [number, number, number],
}

type TMap = {
    elements: TMapElement[],
}

const FloorPreview: FC<{
    mapId: number,
}> = ({
    mapId,
}) => {
    const dispatch = useDispatch();
    const initialViewState = useSelector(selectInitialViewStateByMapId(mapId));

    const selectedDestination = useSelector(selectSelectedDestination(mapId));
    const [viewState, setViewState] = useState<ViewState<any, any, any>>({
        ...INITIAL_VIEW_STATE,
        ...initialViewState,
        zoom: initialViewState.zoom - 2,
    });

    const [showPreview, setShowPreview] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    const iconData = useMemo(() => mapRobotElementsToIconData(getPathDataByMapId(mapId).elements, selectedDestination?.name),
        [mapId, selectedDestination]);
    console.log('iconData', iconData);
    const iconLayer = useMemo<IconLayer>(() => new IconLayer({
        ...iconLayerDefaults,
        id: `icon-layer__${mapId}`,
        data: iconData,
        onClick: (pickingInfo, event) => {
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
        updateTriggers: {
            getPosition: [selectedDestination]
        }
    }), [iconData, selectedDestination, mapId, dispatch]);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    const pathData = useMemo(() => mapRobotElementsToPathData(getPathDataByMapId(mapId).elements), [mapId]);
    const pathLayer = useMemo<PathLayer>(() => new PathLayer({
        ...pathLayerDefaults,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
        id: `path-layer__${mapId}`,
        data: pathData,
    }), [pathData, mapId]);

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

    useEffect(() => {
        setTimeout(() => {
            setShowPreview(true);
        }, 1000)
    }, []);

    useEffect(() => {
        if (selectedDestination?.destinationName) {
            const selectedIcon = iconData.find((icon) => icon.name === selectedDestination.destinationName || icon.id === selectedDestination.name);
            if (selectedIcon) {
                const newPosition = meterToCoordinate([selectedIcon.position[0], selectedIcon.position[1]])
                setViewState((prev) => ({
                    ...prev,
                    longitude: newPosition[0],
                    latitude: newPosition[1],
                    zoom: 21
                }));
            }
        }
    }, [selectedDestination]);

    return (
        <div
            style={{
                border: '1px solid #000',
                height: '400px',
                margin: '10px 10px 10px 0',
                position: 'relative',
                width: '100%',
            }}
            onContextMenu={(event) => event.preventDefault()}
        >
            {showPreview ? (
                <div>
                    <div
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '10px',
                            zIndex: 2,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Button
                            onClick={() => {
                                setViewState((prev) => ({
                                    ...prev,
                                    ...initialViewState,
                                    zoom: initialViewState.zoom - 2,
                                }))}
                            }
                        >
                            <i className="fa fa-location-crosshairs"></i>
                        </Button>
                        <Button
                            onClick={() => {
                                console.log('Switch to user map')
                            }}
                        >
                            <i className="fa fa-map"></i>
                        </Button>
                    </div>
                    <DeckGL
                        viewState={{
                            ...viewState,
                        }}
                        layers={[
                            ...scenegraphLayers,
                            // demoPolygonLayer,
                            pathLayer,
                            iconLayer,
                        ]}
                        controller
                        onViewStateChange={({ viewState: newViewState }) => setViewState(newViewState as ViewState<any, any, any>)}
                    />
                </div>

            ) : (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%'
                    }}
                >
                    <SmallWaitCursor show/>
                </div>
            )}
        </div>
    );
};

export default FloorPreview;
