import { RootState } from '../index';
import { CustomDestinationType } from '../../types/api/destination';

export const selectDestinationIds = (state: RootState) => state.destination.ids;
export const selectDestinationIdsByCustomType = (customType: CustomDestinationType) => (state: RootState) => state.destination.idsByCustomType[customType];
export const selectDestinationIdsByMapId = (mapId: number) => (state: RootState) => state.destination.idsByMapId[mapId];
export const selectDestinationById = (mapId: number) => (state: RootState) => state.destination.entities[mapId];
export const selectDestinationEntities = (state: RootState) => state.destination.entities;
