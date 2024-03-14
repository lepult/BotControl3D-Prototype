import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { robotStatusName, TState } from './robot-status/slice';
import { getIconByMapRobotStatus } from '../utils/iconHelper';
import { getMapRobotStatus } from '../utils/robotStatusHelper';
import { TRobotLayerData } from '../types/deckgl-map';
import { getIconDataFromDestinations } from '../utils/dataHelper';
import { radiansToDegrees, svgToDataURL } from '../utils/conversionHelper';

export const selectDestinationsLayerData = createSelector(
    [
        (state: RootState) => state,
        (_: RootState, mapId: number) => mapId,
    ],
    (state, mapId) => {
        const { destination, misc } = state;
        const destinations = destination.idsByMapId[mapId]?.map((id) => destination.entities[id]) || [];
        const selectedDestinationId = misc.selectedDestination;
        const selectedRobot = state[robotStatusName].entities[state.map.selectedRobot || ''];

        return getIconDataFromDestinations(
            destinations,
            selectedDestinationId,
            selectedRobot?.robotStatus?.currentRoute,
            selectedRobot?.robotStatus?.destination,
            selectedRobot?.robotStatus?.currentDestination,
        );
    }
);

type TSelectRobotLayerData = {
    isPreview?: boolean,
    previewMapRobotId?: string,
    mapId: number,
}

export const selectRobotLayerData = createSelector(
    [
        (state: RootState) => state,
        (_: RootState, config: TSelectRobotLayerData) => config,
    ],
    (state, {
        isPreview,
        previewMapRobotId,
        mapId,
    }) => {
        const robot = state[robotStatusName];
        const { map } = state;

        if (isPreview) {
            const previewMapRobot = state[robotStatusName].entities[previewMapRobotId || ''];
            return previewMapRobot && previewMapRobot.robotStatus?.currentMap?.id === mapId
                ? [getRobotLayerData(previewMapRobot)]
                : [];
        }

        const robotsByMapId = robot.ids
            .filter((id) => robot.entities[id]?.robotStatus?.currentMap?.id === mapId)
            .map((id) => robot.entities[id]) as TState[];
        const selectedRobotId = map.selectedRobot;
        return robotsByMapId
            .filter((data) => data?.puduRobotStatus)
            .map((data) => getRobotLayerData(data, selectedRobotId));
    }
);

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
};

type TDeckglColor = [number, number, number];
export const getRobotColor = (selected: boolean): TDeckglColor => selected
    ? [0, 255, 42]
    : [25,139,44];

type TDeckglOrientation = [number, number, number];
export const getRobotOrientation = (angle: number): TDeckglOrientation => [
    0,
    radiansToDegrees(angle) + 90,
    90
];
