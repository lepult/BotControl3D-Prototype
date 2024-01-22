/* eslint-disable @typescript-eslint/ban-ts-comment */
import ViewState from '@deck.gl/core/typed/controllers/view-state';
import { ScenegraphLayerProps } from '@deck.gl/mesh-layers/typed';
import { COORDINATE_SYSTEM } from '@deck.gl/core/typed';
import { PathLayer } from '@deck.gl/layers/typed';

export const INITIAL_VIEW_STATE: ViewState<any, any, any> = {
    longitude: 0,
    latitude: 0,
    // @ts-ignore
    zoom: 21,
    maxZoom: 25,
    minZoom: 20,
    pitch: 0,
    bearing: 0,
    rotationX: 0,
    maxPitch: 85,
    minPitch: 0,
};

export const scenegraphLayerDefaults: Partial<ScenegraphLayerProps> = {
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    parameters: { cull: true },
    pickable: true,
    sizeScale: 1,
    _lighting: 'pbr',
}

export const pathLayerDefaults: Partial<PathLayer> = {
    id: 'path-layer-track',
    // @ts-ignore
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    pickable: true,
    widthScale: 0.05,
    getWidth: 1,
    widthMinPixels: 2,
    getColor: (d: { color: [number, number, number] }) => d.color || [0, 0, 0],
}