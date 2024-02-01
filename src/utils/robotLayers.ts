import { Color, COORDINATE_SYSTEM, PickingInfo } from '@deck.gl/core/typed';
import { IconLayer } from '@deck.gl/layers/typed';
import { SimpleMeshLayer } from '@deck.gl/mesh-layers/typed';
import { OBJLoader } from '@loaders.gl/obj';
import { svgToDataURL } from './marker';
import { getIconByMapRobotStatus } from './icons';
import { getMapRobotStatus } from './robotStatusHelper';
import { getRobotColor, getRobotOrientation } from './deckGlDataAccessors';
import { TState } from '../redux-modules/robot-status/slice';

export type TRobotLayerData = {
    name: string,
    robotId: string,
    position: [number, number],
    icon: string,
    color: Color,
    orientation: [number, number, number],
}; // TODO Add this type to its own file.

const defaultProps = {
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
    pickable: true,
    sizeScale: 1,
    transitions: {
        getPosition: 2000,
        getOrientation: 2000,
    },

    billboard: true,
    sizeUnits: 'meters' as const,
    alphaCutoff: 0.5,
    getIcon: ({ icon }: TRobotLayerData) => ({
        url: icon,
        height: 128,
        width: 128,
    }),
    getSize: 1.5,

    mesh: 'https://chayns.space/77896-05853/3D-Modelle/Kittybot.obj',
    loaders: [OBJLoader],
    getColor: ({ color }: TRobotLayerData) => color,
    getOrientation: ({ orientation }: TRobotLayerData) => orientation,
    getScale: [1, 1, 1] as [number, number, number],
};

export const getRobotLayerData = (robot: TState, selectedRobot?: string) => {
    const robotId = robot?.robotStatus?.robotId as string;

    return {
        name: robot?.robotStatus?.robotName,
        robotId,
        position: [
            robot?.puduRobotStatus?.robotPose?.x || 0,
            robot?.puduRobotStatus?.robotPose?.y || 0
        ],
        icon: svgToDataURL(getIconByMapRobotStatus(
            getMapRobotStatus(
                robot?.robotStatus,
                robot?.puduRobotStatus
            ),
            ...getRobotColor(robotId === selectedRobot),
        )),
        color: getRobotColor(robotId === selectedRobot),
        orientation: getRobotOrientation(robot?.puduRobotStatus?.robotPose?.angle || 0),
    } as TRobotLayerData;
}

export const getRobotLayers = (
    id: string,
    data: TRobotLayerData[],
    onClick: (pickingInfo: PickingInfo) => void,
    updateTrigger: string
): [IconLayer, SimpleMeshLayer] => {
    const {
        sizeScale,
        coordinateSystem,
        pickable,
        transitions,

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
    } = defaultProps;

    const defaults = {
        sizeScale,
        coordinateSystem,
        pickable,
        transitions,
        data,
        onClick,
    }

    return [
        new IconLayer({
            id: `${id}-icon`,
            ...defaults,
            billboard,
            sizeUnits,
            alphaCutoff,
            getPosition: (d: TRobotLayerData) => [...d.position, 2],
            getIcon,
            getSize,
            updateTriggers: {
                getIcon: [updateTrigger],
            },
        }),
        new SimpleMeshLayer({
            id: `${id}-mesh`,
            ...defaults,
            mesh,
            loaders,
            getPosition: (d: TRobotLayerData) => [...d.position, 0],
            getColor,
            getOrientation,
            getScale, // TODO Maybe remove since its just the default?
            updateTriggers: {
                getColor: [updateTrigger],
            },
        }),
    ]
}