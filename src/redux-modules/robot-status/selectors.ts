import { RootState } from '../index';
import { robotStatusName } from './slice';

export const selectRobotStatus = (state: RootState) => state[robotStatusName];
export const selectRobotStatusFetchState = (state: RootState) => state[robotStatusName].fetchState;

export const selectRobotIds = (state: RootState) => state[robotStatusName].ids;

export const selectRobotStatusById = (robotId: string) => (state: RootState) => state[robotStatusName].entities[robotId]?.robotStatus;
