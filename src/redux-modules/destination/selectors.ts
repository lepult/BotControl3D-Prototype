import { RootState } from '../index';
import { createSelector } from '@reduxjs/toolkit';
import { CustomDestinationType } from '../../types/api/destination';

export const selectDestinationIds = (state: RootState) => state.destination.ids;
export const selectDestinationIdsByMapId = (mapId: number) => (state: RootState) => state.destination.idsByMapId[mapId];
export const selectDestinationById = (mapId: number) => (state: RootState) => state.destination.entities[mapId];
export const selectDestinationEntities = (state: RootState) => state.destination.entities;

export const selectDestinationsByCustomType = createSelector(
    [
        (state: RootState) => state.destination,
        (_: RootState, customType: CustomDestinationType) => customType,
    ],
    (
        destination,
        customType
    ) => (destination.idsByCustomType[customType] || []).map((id) => destination.entities[id]),
);