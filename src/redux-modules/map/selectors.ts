import { RootState } from '../index';

export const selectMapIds = (state: RootState) => state.map.ids;
export const selectMapById = (mapId: number) => (state: RootState) => state.map.entities[mapId];