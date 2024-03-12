export const trackElements = [{
    type: 'track',
    vector: [-0.69346, 20.036, 0.28574, 19.355],
    id: '0',
    width: 0,
    maxSpeed: 0,
    dualWidth: 0,
    leftMode: false,
    middleMode: true
}, {
    type: 'track',
    vector: [-8.9193, 8.8285, -9.796, 7.6781],
    id: '1',
    width: 0,
    maxSpeed: 0,
    dualWidth: 0,
    leftMode: false,
    middleMode: true
}, {
    type: 'track',
    vector: [-6.4114, 11.785, -8.9193, 8.8285],
    id: '2',
    width: 0,
    maxSpeed: 0,
    dualWidth: 0,
    leftMode: false,
    middleMode: true
}];

export const virtualWallElements = [{
    type: 'virtual_wall',
    vector: [-4.6297, 6.9375, -7.0581, 8.8428],
    id: '0',
}, {
    type: 'virtual_wall',
    vector: [-7.0581, 8.8428, 1.4111, 19.062],
    id: '1',
}, {
    type: 'virtual_wall',
    vector: [1.4111, 19.062, 3.9032, 16.917],
    id: '2',
}];

export const nodeElements = [{
    type: 'node',
    vector: [0.65825, -0.75784, 0],
    id: '0'
}, {
    type: 'node',
    vector: [-0.69346, 20.036, 0],
    id: '1'
}, {
    type: 'node',
    vector: [3.9475, 22.074, 0],
    id: '2'
}];

export const sourceElements = [{
    type: 'source',
    vector: [0.032623, 6.5547, -1.3943],
    name: '01',
    mode: 'table',
    id: '01',
    group: 'Atrium',
    dir: -1.3943,
    dirMode: 2,
    doubleDir: 0
}, {
    type: 'source',
    vector: [-3.7985, 7.4777, 1.0032],
    name: '10',
    mode: 'table',
    id: '10',
    group: 'Atrium',
    dir: 1.0032,
    dirMode: 2,
    doubleDir: 0
}, {
    type: 'source',
    vector: [-2.4412, 9.0587, 1.0957],
    name: '11',
    mode: 'table',
    id: '11',
    group: 'Atrium',
    dir: 1.0957,
    dirMode: 2,
    doubleDir: 0
}];

export const chargingPileElements = [{
    type: 'charging_pile',
    vector: [0.7712, 6.9378, -2.411],
    id: 'Station West',
    group: 'Station West'
}, {
    type: 'charging_pile',
    vector: [1.3245, 6.5601, -2.3571],
    id: 'Station Ost',
    group: 'Station Ost'
}];


export const trackPathData = [{
    id: '0',
    type: 'track',
    name: '0',
    color: [36, 36, 36],
    path: [-0.69346, 20.036, 0.1, 0.28574, 19.355, 0.1]
}, {
    id: '1',
    type: 'track',
    name: '1',
    color: [36, 36, 36],
    path: [-8.9193, 8.8285, 0.1, -9.796, 7.6781, 0.1]
}, {
    id: '2',
    type: 'track',
    name: '2',
    color: [36, 36, 36
    ],
    path: [-6.4114, 11.785, 0.1, -8.9193, 8.8285, 0.1]
}];

export const virtualWallPathData = [{
    id: '0',
    type: 'virtual_wall',
    name: '0',
    color: [157, 0, 0],
    path: [-4.6297, 6.9375, 0.1, -7.0581, 8.8428, 0.1]
}, {
    id: '1',
    type: 'virtual_wall',
    name: '1',
    color: [157, 0, 0],
    path: [-7.0581, 8.8428, 0.1, 1.4111, 19.062, 0.1]
}, {
    id: '2',
    type: 'virtual_wall',
    name: '2',
    color: [157, 0, 0],
    path: [1.4111, 19.062, 0.1, 3.9032, 16.917, 0.1]
}];
