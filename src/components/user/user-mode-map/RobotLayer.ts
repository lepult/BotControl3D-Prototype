import {
    Color,
    CompositeLayer,
    COORDINATE_SYSTEM,
    DefaultProps,
    PickingInfo,
} from '@deck.gl/core/typed';
import { IconLayer } from '@deck.gl/layers/typed';
import { SimpleMeshLayer } from '@deck.gl/mesh-layers/typed';
import { OBJLoader } from '@loaders.gl/obj';

type TDeckglOrientation = [number, number, number]; // TODO Add this type to its own file.
type TDeckglScale = [number, number, number]; // TODO Add this type to its own file.
type TDeckglIcon = {
    url: string,
    height: number,
    width: number,
}; // TODO Add this type to its own file.

export type TRobotLayerData = {
    name: string,
    robotId: string,
    position: [number, number],
    icon: string,
    color: Color,
    orientation: TDeckglOrientation,
}; // TODO Add this type to its own file.

const defaultProps: DefaultProps = {
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    pickable: true,
    sizeScale: {type: 'number', value: 1, min: 0},
    transition: {
        type: 'object',
        value: { getPosition: 2000, }
    },
    getPosition: {
        type: 'accessor',
        value: ({ position }: TRobotLayerData) => [...position, 0],
    },

    billboard: true,
    sizeUnits: 'meters',
    alphaCutoff: {
        type: 'number',
        value: 0.5,
        min: 0,
        max: 1
    },
    getIcon: {
        type: 'accessor',
        value: ({ icon }: TRobotLayerData) => ({
            url: icon,
            height: 128,
            width: 128,
        }),
    },
    getSize: {type: 'accessor', value: 1},

    mesh: {type: 'object', value: null, async: true},
    loaders: [OBJLoader],
    getColor: ({ color }: TRobotLayerData) => color,
    getOrientation: ({ orientation }: TRobotLayerData) => orientation,
    getScale: {type: 'accessor', value: [1, 1, 1]},
};

type RobotLayerProps = {
    data: TRobotLayerData[],
    sizeScale: number,
    billboard: boolean,
    sizeUnits: 'meters' | 'common' | 'pixels',
    alphaCutoff: number,
    mesh: string,
    getPosition: (data: TRobotLayerData) => [number, number],
    getIcon: (data: TRobotLayerData) => TDeckglIcon,
    getSize: (data: TRobotLayerData) => number,
    getColor: (data: TRobotLayerData) => Color,
    getOrientation: (data: TRobotLayerData) => TDeckglOrientation,
    getScale: (data: TRobotLayerData) => TDeckglScale,
    updateTriggers: [string | undefined],
}

class RobotLayer extends CompositeLayer<RobotLayerProps> {
    renderLayers() {
        const {
            sizeScale,
            getPosition,
            onClick,
            updateTriggers,

            billboard,
            sizeUnits,
            alphaCutoff,
            getIcon,
            getSize,

            mesh,
            loaders,
            getColor,
            getOrientation,
            getScale,
        } = this.props;

        console.log('RobotLayer', this.props.data);

        return [
            new IconLayer(this.getSubLayerProps({
                id: 'icon',
                updateTriggers: {
                    getIcon: updateTriggers,
                },
                data: this.props.data,
                billboard,
                sizeUnits,
                sizeScale,
                alphaCutoff,
                getPosition: (data: TRobotLayerData) => [
                    ...getPosition(data),
                    2
                ],
                getIcon,
                getSize,
                onClick,
            })),
            new SimpleMeshLayer(this.getSubLayerProps({
                id: 'mesh',
                updateTriggers: {
                    getColor: updateTriggers,
                },
                data: this.props.data,
                sizeScale,
                mesh,
                loaders,
                getPosition: (data: TRobotLayerData) => [
                    ...getPosition(data),
                    0
                ],
                getColor,
                getOrientation,
                getScale,
                onClick,
            })),
        ]
    };
}

RobotLayer.layerName = 'RobotLayer';
RobotLayer.defaultProps = defaultProps;

export default RobotLayer;
