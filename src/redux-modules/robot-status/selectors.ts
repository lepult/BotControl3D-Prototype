import { createDraftSafeSelector, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { robotStatusName, TState } from './slice';
import { getRobotLayerData } from '../../utils/robotLayers';

export const selectRobotStatus = (state: RootState) => state[robotStatusName];
export const selectRobotStatusFetchState = (state: RootState) => state[robotStatusName].fetchState;

export const selectRobotIds = (state: RootState) => state[robotStatusName].ids;

export const selectRobotsByCurrentMap = (mapId: number) => (state: RootState) => {
    const robots = state[robotStatusName].ids.map((id) => state[robotStatusName].entities[id]);
    return robots.filter((robot) => robot?.robotStatus?.currentMap?.id === mapId);
}

export const selectRobotEntities = (state: RootState) => state[robotStatusName].entities;

export const selectRobotStatusById = (robotId: string) => (state: RootState) => state[robotStatusName].entities[robotId]?.robotStatus;
export const selectRobotById = (robotId: string) => (state: RootState) => state[robotStatusName].entities[robotId];

export const selectSelectedRobot = (state: RootState) => state[robotStatusName].entities[state.map.selectedRobot || ''];

export const selectRobotsByMapId = createDraftSafeSelector(
    [
        (state: RootState) => state[robotStatusName],
        (_: RootState, mapId: number) => mapId,
    ],
    (robot, mapId) => robot.ids
        .filter((id) => robot.entities[id]?.robotStatus?.currentMap?.id === mapId)
        .map((id) => robot.entities[id]) as TState[],
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
)
