// region Imports
import { Position, Color, TransitionInterpolator } from '@deck.gl/core/typed';
import { IconLayer, PathLayer, PolygonLayer } from '@deck.gl/layers/typed';
import { ScenegraphLayer } from '@deck.gl/mesh-layers/typed';
import { IMergedMapElement, IZone } from './pudu-api/robotMap';
import { CustomDestinationType } from './api/destination';
// endregion

export interface IIconData extends IMergedMapElement {
    name: string;
    position: Position;
    color?: Color;
    angle?: number;
    selected?: boolean;
    routeData: {
        isRouteDestination: boolean;
        isNextDestination: boolean;
        isEarlierDestination: boolean;
        isFinalDestination: boolean;
        isPreviousDestination: boolean;
    },
    customType?: CustomDestinationType;
}

export interface IPathData extends IMergedMapElement {
    name: string;
    path: Array<number>;
    color?: Color;
}

export type ISceneGraphData = {
    name: string;
    position: [number, number];
    angle: number;
    color?: Color;
};

export interface IPolygonData extends IZone {
    name: string;
    color?: Color;
}

export type TTooltip = {
    picked?: boolean;
    object?: IIconData & IPathData & ISceneGraphData & IPolygonData;
    x?: number;
    y?: number;
};

export type TLayers = (IconLayer<IIconData, NonNullable<unknown>>
    | PathLayer<IPathData, NonNullable<unknown>>
    | ScenegraphLayer<ISceneGraphData, NonNullable<unknown>>
    | PolygonLayer<IPolygonData, NonNullable<unknown>>)[];

export type TViewState = {
    bearing: number,
    latitude: number,
    longitude: number,
    pitch: number,
    zoom: number,
    maxZoom?: number,
    minZoom?: number,
    rotationX?: number,
    maxPitch?: number,
    minPitch?: number,
    transitionDuration?: number,
    transitionInterpolator?: TransitionInterpolator,
}

export enum MapRobotStatus {
    'Offline' = 'Offline',
    'Idle' = 'Idle',
    'Charged' = 'Charged',
    'Charging' = 'Charging',
    'ChargingError' = 'ChargingError',
    'ArrivedAtDiningOutlet' = 'ArrivedAtDiningOutlet',
    'SendToChargingPile' = 'SendToChargingPile',
    'WaitForDoor' = 'WaitForDoor',
    'WaitForElevator' = 'WaitForElevator',
    'MovingWithElevator' = 'MovingWithElevator',
    'ArrivedAtPickupDestination' = 'ArrivedAtPickupDestination',
    'PrepareDriveToDestination' = 'PrepareDriveToDestination',
    'SendToDestination' = 'SendToDestination',
    'ArrivedAtDestination' = 'ArrivedAtDestination',
    'Avoid' = 'Avoid',
    'Blocked' = 'Blocked',
    'Cancel' = 'Cancel',
    'Error' = 'Error',
    'Pause' = 'Pause',
}

export enum PreviewType {
    Robot,
    Floor,
}

export enum DragMode {
    translate = 'translate',
    rotate = 'rotate',
}

export type TUndoStackItem = {
    id: string,
    position: [number, number, number],
    orientation: [number, number, number],
}

export type TRobotLayerData = {
    name: string,
    robotId: string,
    position: [number, number],
    icon: string,
    color: Color,
    orientation: [number, number, number],
};
