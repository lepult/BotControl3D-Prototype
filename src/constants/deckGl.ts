/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ScenegraphLayerProps } from '@deck.gl/mesh-layers/typed';
import { PathStyleExtension } from '@deck.gl/extensions/typed';
import { COORDINATE_SYSTEM } from '@deck.gl/core/typed';
import { IconLayerProps, PathLayerProps } from '@deck.gl/layers/typed';
import { IIconData, IPathData, TViewState } from '../types/deckgl-map';
import { blueMarker, redMarker } from '../assets/markers';
import { MapElementType } from '../types/pudu-api/robotMap';
import { svgToDataURL } from '../utils/conversionHelper';

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
    extensions: [new PathStyleExtension({ dash: true })],
    // @ts-ignore
    getDashArray: (data: IPathData) => data.type === MapElementType.track
        ? [0, 0]
        : [20, 10],
};

export const iconLayerDefaults: Partial<IconLayerProps> = {
    id: 'icon-layer',
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    pickable: true,
    sizeScale: 3,
    getSize: 1,
    sizeUnits: 'meters',
    alphaCutoff: 0.5,
    getPosition: (d: IIconData) => [d.position[0], d.position[1], 0.1],
    getIcon: (d: IIconData) => ({
        url: svgToDataURL(d.selected ? redMarker() : blueMarker()),
        height: 128,
        width: 128,
    }),
    getColor: (d: IIconData) => d.color || [0, 0, 0],
};

export const CONTROLLER_DEFAULTS = {
    scrollZoom: true,
    dragPan: true,
    dragRotate: true,
    doubleClickZoom: false,
    touchZoom: true,
    touchRotate: true,
    keyboard: true,
};
