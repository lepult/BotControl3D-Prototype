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
    widthScale: 1,
    getWidth: 0.025,
    widthMinPixels: 0,
    jointRounded: true,
    capRounded: true,
    billboard: true,
    getColor: (d: { color: [number, number, number] }) => d.color || [0, 0, 0],
};

export const iconLayerDefaults: Partial<IconLayerProps> = {
    id: 'icon-layer',
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    pickable: true,
    sizeScale: 3,
    getSize: 1,
    sizeMinPixels: 100,
    sizeUnits: 'meters',
    alphaCutoff: 0.5,
    getPosition: (d: IIconData) => [d.position[0], d.position[1], 0.5],
    getIcon: (d: IIconData) => ({
        url: svgToDataURL(d.selected ? redMarker() : blueMarker()),
        height: 128,
        width: 128,
    }),
    getColor: (d: IIconData) => d.color || [0, 0, 0],
}

export const CONTROLLER_DEFAULTS = {
    scrollZoom: true,
    dragPan: true,
    dragRotate: true,
    doubleClickZoom: true,
    touchZoom: true,
    touchRotate: true,
    keyboard: true,
};
