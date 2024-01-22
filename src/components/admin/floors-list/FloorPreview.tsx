import React, { FC, useMemo, useState } from 'react';
import ViewState from '@deck.gl/core/typed/controllers/view-state';
import DeckGL from '@deck.gl/react/typed';
import { ScenegraphLayer } from '@deck.gl/mesh-layers/typed';
import { demoPolygonLayer } from '../../../constants/layers';
import {
    iconLayerDefaults,
    INITIAL_VIEW_STATE,
    pathLayerDefaults,
    scenegraphLayerDefaults
} from '../../../constants/deckGl';
import { mapRobotElementsToIconData, mapRobotElementsToPathData } from '../../../utils/dataHelper';
import { IconLayer, PathLayer } from '@deck.gl/layers/typed';
import { TMapElement } from '../../../types/pudu-api/robotMap';

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
    floorModels: TGltfModel[],
    map: TMap,
}> = ({
    floorModels,
    map,
}) => {
    const [viewState, setViewState] = useState<ViewState<any, any, any>>(INITIAL_VIEW_STATE);

    const iconData = useMemo(() => mapRobotElementsToIconData(map.elements), [map]);
    const iconLayer = useMemo<IconLayer>(() => new IconLayer({
        ...iconLayerDefaults,
        data: iconData,
    }), [iconData]);

    const pathData = useMemo(() => mapRobotElementsToPathData(map.elements), [map]);
    const pathLayer = useMemo<PathLayer>(() => new PathLayer({
        ...pathLayerDefaults,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
        data: pathData,
    }), [pathData]);

    const scenegraphLayers = useMemo<ScenegraphLayer[]>(() => floorModels.map((floorModel) => new ScenegraphLayer({
        ...scenegraphLayerDefaults,
        id: floorModel.id,
        data: [{
            position: floorModel.position,
            orientation: floorModel.orientation,
        }],
        scenegraph: floorModel.url,
        getPosition: (m: TGltfModel) => m.position,
        getOrientation: (m: TGltfModel) => m.orientation,
    })), [floorModels]);

    return (
        <div style={{
            border: '1px solid #000',
            height: '400px',
            margin: '10px 10px 10px 0',
            position: 'relative',
            width: '100%',
        }}>
            <DeckGL
                viewState={{
                    ...viewState,
                    minZoom: 19,
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
    );
};

export default FloorPreview;
