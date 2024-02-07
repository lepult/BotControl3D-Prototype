import { RootState } from '../index';
import { robotStatusName } from './slice';

export const selectRobotIds = (state: RootState) => state[robotStatusName].ids;

export const selectRobotEntities = (state: RootState) => state[robotStatusName].entities;

export const selectRobotStatusById = (robotId: string) => (state: RootState) => state[robotStatusName].entities[robotId]?.robotStatus;
export const selectRobotById = (robotId: string) => (state: RootState) => state[robotStatusName].entities[robotId];

export const selectSelectedRobot = (state: RootState) => state[robotStatusName].entities[state.map.selectedRobot || ''];

