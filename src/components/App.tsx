import React, { useState } from 'react';
import DeckGL from '@deck.gl/react/typed';
import { ScenegraphLayer, SimpleMeshLayer } from '@deck.gl/mesh-layers/typed';
import { OBJLoader } from '@loaders.gl/obj';
import { COORDINATE_SYSTEM } from '@deck.gl/core/typed';
import { PolygonLayer } from '@deck.gl/layers/typed';

type Location = {
    position: number[],
    angle: number,
    color: number[],
}

export const INITIAL_VIEW_STATE = {
    longitude: 0,
    latitude: 0,
    zoom: 21,
    maxZoom: 25,
    minZoom: 19,
    pitch: 0,
    bearing: 0,
    rotationX: 20,
};


const meshLayer = new SimpleMeshLayer( {
    id: 'mesh-layer',
    parameters: {cull: true},
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    // mesh: 'https://pizzaaa.chayns.site/space/Scaniverse_2024-01-03_135241/Scaniverse_2024_01_03_135241.obj',
    // mesh: 'https://tappqa.tobit.com/BotControl3D/Models/Scaniverse/Scaniverse_2024_01_03_135241.txt',
    mesh: 'https://w-lpinkernell-z.tobit.ag/models/Scaniverse_2024_01_03_135241.obj',
    texture: 'https://w-lpinkernell-z.tobit.ag/models/Scaniverse_2024_01_03_135241.jpg',
    textureParameters: {
        [WebGLRenderingContext.TEXTURE_WRAP_S]: WebGLRenderingContext.CLAMP_TO_EDGE,
        [WebGLRenderingContext.TEXTURE_WRAP_T]: WebGLRenderingContext.CLAMP_TO_EDGE,
        [WebGLRenderingContext.TEXTURE_MIN_FILTER]: WebGLRenderingContext.LINEAR_MIPMAP_LINEAR,
        [WebGLRenderingContext.TEXTURE_MAG_FILTER]: WebGLRenderingContext.LINEAR,
    },
    loaders: [OBJLoader],
    data: [{
        position: [0, 0],
        color: [255, 0, 0],
    }],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    getPosition: (d) => d.position,
    getOrientation: () => [0, 0, 90],
});

const polygonLayer = new PolygonLayer({
    id: 'polygon-layer',
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    data: [{
        contour: [[10, 10, 0], [-10, 10, 0], [-10, -10, 0], [10, -10, 0]]
    }],
    pickable: true,
    stroked: false,
    filled: true,
    wireframe: false,
    lineWidthMinPixels: 1,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    getPolygon: d => d.contour,
    getFillColor: () => [0, 255, 0],
    getLineColor: [80, 80, 80],
    getLineWidth: 1
});

const scenegraphLayer = new ScenegraphLayer({
    id: 'scenegraph-layer',
    parameters: {cull: true},
    data: [{
        position: [0, 0],
    }],
    pickable: true,
    scenegraph: 'https://w-lpinkernell-z.tobit.ag/models/Gltf-Test.glb',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    getPosition: d => d.position,
    getOrientation: () => [0, 0, 90],
    sizeScale: 1,
    _lighting: 'pbr'
})

const App = () => {
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

    return (
        <DeckGL
            viewState={viewState}
            layers={[
                // meshLayer,
                scenegraphLayer,
                polygonLayer,
            ]}
            controller
            onViewStateChange={(v) => {
                // @ts-ignore
                setViewState(v.viewState);
            }}
        />
    );
};

export default App;
