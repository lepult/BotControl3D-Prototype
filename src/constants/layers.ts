import { PathLayer, PolygonLayer } from '@deck.gl/layers/typed';
import { COORDINATE_SYSTEM } from '@deck.gl/core/typed';

export const demoPolygonLayer = new PathLayer({
    id: 'polygon-layer',
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    data: [{
        path: [[10, 0, 0], [0, 0, 0]],
        color: [255, 0, 0]
    }, {
        path: [[0, 10, 0], [0, 0, 0]],
        color: [0, 255, 0]
    }, {
        path: [[0, 0, 10], [0, 0, 0]],
        color: [0, 0, 255]
    }],
    pickable: false,
    widthScale: 1,
    getWidth: 1,
    widthMinPixels: 10,
    widthMaxPixels: 10,
    jointRounded: true,
    capRounded: true,
    billboard: true,
    opacity: 0.5,
    getPath: (d) => d.path,
    getColor: (d) => d.color || [0, 0, 0],
});
