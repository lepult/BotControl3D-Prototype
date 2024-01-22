// region Imports
import { Position, Color } from '@deck.gl/core/typed';
import { IconLayer, PathLayer, PolygonLayer } from '@deck.gl/layers/typed';
import { ScenegraphLayer } from '@deck.gl/mesh-layers/typed';
import { IMergedMapElement, IZone } from './pudu-api/robotMap';
// endregion

export interface IIconData extends IMergedMapElement {
    name: string;
    position: Position;
    color?: Color;
    angle?: number;
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
    zoom: number
}
