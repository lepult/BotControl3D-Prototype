import { COORDINATE_SYSTEM } from '@deck.gl/core/typed';
import { OBJLoader } from '@loaders.gl/obj';
import { PathStyleExtension } from '@deck.gl/extensions/typed';
import { IPathData } from '../types/deckgl-map';
import { MapElementType } from '../types/pudu-api/robotMap';
import { TRobotLayerData } from '../components/user/user-mode-map/RobotLayer';
import { IIconData } from '../utils/dataHelper';
import { ModelType } from './models';

export const getLayerIcon = (url: string) => ({
    url,
    height: 128,
    width: 128,
})

export const DEFAULT_LAYER_PROPS = {
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    pickable: true,
}

export const DEFAULT_ROBOT_ICON_LAYER_PROPS = {
    getIcon: ({ icon }: TRobotLayerData) => getLayerIcon(icon),
    getPosition: (d: TRobotLayerData) => [...d.position, 2],
    getSize: 1.5,
}

export const DEFAULT_ROBOT_MESH_LAYER_PROPS = {
    loaders: [OBJLoader],
    mesh: 'https://chayns.space/77896-05853/3D-Modelle/Kittybot_Compressed2.obj',
    sizeScale: 1,
    getColor: ({ color }: TRobotLayerData) => color,
    getOrientation: ({ orientation }: TRobotLayerData) => orientation,
};

export const DEFAULT_ROBOT_LAYER_PROPS = {
    transitions: {
        getPosition: 2000,
        getOrientation: 2000,
    }
};

export const DEFAULT_DESTINATION_LAYER_PROPS = {
    getPosition: (d: IIconData): [number, number, number] => [d.position[0], d.position[1], 0.5],
}

export const DEFAULT_ICON_LAYER_PROPS = {
    alphaCutoff: 0.5,
    sizeUnits: 'meters',
};

export const DEFAULT_PATH_LAYER_PROPS = {
    billboard: true,
    capRounded: true,
    extensions: [new PathStyleExtension({ dash: true })],
    getColor: (d: { color: [number, number, number] }) => d.color || [0, 0, 0],
    getDashArray: (data: IPathData) => data.type === MapElementType.track
        ? [0, 0]
        : [20, 10],
    getWidth: 0.025,
    jointRounded: true,
    widthMinPixels: 0,
    widthScale: 1,
};

export const DEFAULT_SCENEGRAPH_LAYER_PROPS = {
    parameters: { cull: true },
    _lighting: 'pbr',
    getPosition: (data: ModelType) => data.position,
    getOrientation: (data: ModelType) => data.orientation,
};