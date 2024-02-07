import { TViewState } from '../types/deckgl-map';

export const INITIAL_VIEW_STATE: TViewState = {
    longitude: 0,
    latitude: 0,
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
