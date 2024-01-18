import { PolygonLayer } from '@deck.gl/layers/typed';
import { COORDINATE_SYSTEM } from '@deck.gl/core/typed';

export const demoPolygonLayer = new PolygonLayer({
    id: 'polygon-layer',
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    data: [{
        contour: [[50, 0, 0], [0, 0, 0]],
        color: [255, 0, 0]
    }, {
        contour: [[-50, 0, 0], [0, 0, 0]],
        color: [150, 0, 0]
    }, {
        contour: [[0, 50, 0], [0, 0, 0]],
        color: [0, 255, 0]
    }, {
        contour: [[0, -50, 0], [0, 0, 0]],
        color: [0, 150, 0]
    }],
    pickable: false,
    stroked: true,
    filled: true,
    wireframe: false,
    lineWidthMinPixels: 1,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    getPolygon: d => d.contour,
    getFillColor: () => [0, 255, 0],
    getLineColor: (d) => d.color,
    getLineWidth: 1
});
