// region elements
interface IMapElement {
    id: string;
    type: string;
    vector: number[];

    // ToDo: Check properties
    [key: string]: any;
}

export interface ISourceElement extends IMapElement {
    id: string;
    dir: number;
    dirMode: number;
    dock_id: string;
    doubleDir: number;
    mode: 'table' | 'dining_outlet' | 'transit' | 'dishwashing' | 'parking' | string;
    name: string;
    type: MapElementType.source;
    group?: string;
    // [x, y, z]
    // x,y is coordinate z is direction, but this is field temporarily 0
    vector: [number, number, number];

    // ToDo: Check properties
    [key: string]: any;
}

interface ITrackElement extends IMapElement {
    id: string;
    dock_id: string;
    dualWidth: number;
    leftMode: boolean;
    maxSpeed: number;
    middleMode: boolean;
    type: MapElementType.track;
    width: string;
    // [x1, y1, x2, y2]
    // means a straight line between (x1,y1) and (x2,y2)
    vector: [number, number, number, number];

    // ToDo: Check properties
    [key: string]: any;
}

interface ICircleElement extends IMapElement {
    type: MapElementType.circle;
    // Composed of multiple adjacent nodes, such as [1, 2, 3, 4, 3, 2, 1]
    vector: number[];
    dock_id: string;

    // ToDo: Check properties
    [key: string]: any;
}

interface INodeElement extends IMapElement {
    id: string;
    dock_id: string;
    type: MapElementType.node;

    // ToDo: Check properties
    [key: string]: any;
}

interface IVirtualWallElement extends IMapElement {
    id: string;
    dock_id: string;
    type: MapElementType.virtualWall;

    // ToDo: Check properties
    [key: string]: any;
}

interface IChargingPileElement extends IMapElement {
    id: string;
    dock_id: string;
    group: string;
    type: MapElementType.chargingPile;

    // ToDo: Check properties
    [key: string]: any;
}

export type TMapElement =
    ISourceElement
    | ITrackElement
    | ICircleElement
    | INodeElement
    | IVirtualWallElement
    | IChargingPileElement
    | IMapElement;

export interface IMergedMapElement {
    id: string;
    type: MapElementType | string;
    vector?: number[];

    dir?: number;
    dirMode?: number;
    dock_id?: string;
    doubleDir?: number;
    mode?: 'table' | 'dining_outlet' | 'transit' | 'dishwashing' | 'parking' | string;
    name?: string;
    group?: string;
    dualWidth?: number;
    leftMode?: boolean;
    maxSpeed?: number;
    middleMode?: boolean;
    width?: string;
}
// endregion

// region zones
export interface IZone {
    id: string;
    maxSpeed: number;
    nodes: number[][];
    type: 'SpeedLimit' | 'NoDetour' | string;
}
// endregion

export type TRobotMap = {
    elements: Array<TMapElement>;
    zones?: Array<IZone>;
};

export enum MapElementType {
    source = 'source',
    track = 'track',
    circle = 'circle',
    node = 'node',
    virtualWall = 'virtual_wall',
    chargingPile = 'charging_pile'
}