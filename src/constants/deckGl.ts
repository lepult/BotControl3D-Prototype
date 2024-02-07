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

export const CONTROLLER_DEFAULTS = {
    scrollZoom: true,
    dragPan: true,
    dragRotate: true,
    doubleClickZoom: false,
    touchZoom: true,
    touchRotate: true,
    keyboard: true,
};
