import { RootState } from '../index';

export const selectMapIds = (state: RootState) => state.map.ids;
export const selectMapEntities = (state: RootState) => state.map.entities;
export const selectMapById = (mapId: number) => (state: RootState) => state.map.entities[mapId];
export const selectMapsFetchState = (state: RootState) => state.map.fetchState;
export const selectInitialViewStateByMapId = (mapId: number) => (state: RootState) => state.map.initialViewStateById[mapId] || {};
export const selectSelectedMap = (state: RootState) => state.map.selectedMap;
export const selectSelectedRobotId = (state: RootState) => state.map.selectedRobot;
export const selectFollowRobot = (state: RootState) => state.map.followRobot;
