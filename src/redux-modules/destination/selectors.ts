import { RootState } from '../index';

export const selectDestinationIds = (state: RootState) => state.destination.ids;
export const selectDestinationIdsByMapId = (mapId: number) => (state: RootState) => state.destination.idsByMapId[mapId];
export const selectDestinationById = (mapId: number) => (state: RootState) => state.destination.entities[mapId];
export const selectDestinationEntities = (state: RootState) => state.destination.entities;
