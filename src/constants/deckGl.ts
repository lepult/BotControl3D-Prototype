/* eslint-disable @typescript-eslint/ban-ts-comment */
import ViewState from '@deck.gl/core/typed/controllers/view-state';
import { ScenegraphLayerProps } from '@deck.gl/mesh-layers/typed';
import { COORDINATE_SYSTEM } from '@deck.gl/core/typed';
import { IconLayerProps, PathLayerProps } from '@deck.gl/layers/typed';
import { IIconData, TViewState } from '../types/deckgl-map';
import { svgToDataURL } from '../utils/marker';
import { blueMarker, redMarker } from '../assets/markers';

export const INITIAL_VIEW_STATE: TViewState = {
    longitude: 0,
    latitude: 0,
    // @ts-ignore
    zoom: 21,
    maxZoom: 25,
    minZoom: 18,
    pitch: 0,
    bearing: 0,
    rotationX: 0,
    maxPitch: 80,
    minPitch: 0,
};

export const scenegraphLayerDefaults: Partial<ScenegraphLayerProps> = {
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    parameters: { cull: true },
    pickable: true,
    sizeScale: 1,
    _lighting: 'pbr',
};

export const pathLayerDefaults: Partial<PathLayerProps> = {
    id: 'path-layer-track',
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    pickable: true,
    widthScale: 0.05,
    getWidth: 1,
    widthMinPixels: 2,
    getColor: (d: { color: [number, number, number] }) => d.color || [0, 0, 0],
};

export const iconLayerDefaults: Partial<IconLayerProps> = {
    id: 'icon-layer',
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    pickable: true,
    sizeScale: 3,
    getSize: 1,
    sizeUnits: 'meters',
    getPosition: (d: IIconData) => [d.position[0], d.position[1], 0.5],
    getIcon: (d: IIconData) => ({
        url: svgToDataURL(d.selected ? redMarker() : blueMarker()),
        height: 128,
        width: 128,
    }),
    getColor: (d: IIconData) => d.color || [0, 0, 0],
}