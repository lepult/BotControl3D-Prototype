import { RootState } from '../index';
import { robotStatusName } from './slice';

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
