import { RootState } from '../index';
import { CustomDestinationType } from '../../types/api/destination';
import { createDraftSafeSelector } from '@reduxjs/toolkit';

export const selectDestinationIds = (state: RootState) => state.destination.ids;
export const selectDestinationIdsByCustomType = (customType: CustomDestinationType) => (state: RootState) => state.destination.idsByCustomType[customType];
export const selectDestinationIdsByMapId = (mapId: number) => (state: RootState) => state.destination.idsByMapId[mapId];
export const selectDestinationById = (mapId: number) => (state: RootState) => state.destination.entities[mapId];
export const selectDestinationEntities = (state: RootState) => state.destination.entities;

export const selectDestinations = createDraftSafeSelector(
    (state: RootState) => state.destination,
    (destination) => destination.ids.map((id) => destination.entities[id])
);

export const selectDestinationsByMapId = createDraftSafeSelector(
    [
        (state: RootState) => state.destination,
        (_: RootState, mapId: number) => mapId,
    ],
    (destination, mapId) => destination.idsByMapId[mapId]?.map((id) => destination.entities[id]) || [],
);
