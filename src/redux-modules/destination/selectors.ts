import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { getIconDataFromDestinations } from '../../utils/dataHelper';
import { robotStatusName } from '../robot-status/slice';

export const selectDestinationIds = (state: RootState) => state.destination.ids;
export const selectDestinationIdsByMapId = (mapId: number) => (state: RootState) => state.destination.idsByMapId[mapId];
export const selectDestinationById = (mapId: number) => (state: RootState) => state.destination.entities[mapId];
export const selectDestinationEntities = (state: RootState) => state.destination.entities;

export const selectDestinationsLayerData = createSelector(
    [
        (state: RootState) => state,
        (_: RootState, mapId: number) => mapId,
    ],
    (state, mapId) => {
        const { destination, misc } = state;
        const destinations = destination.idsByMapId[mapId]?.map((id) => destination.entities[id]) || [];
        const selectedDestinationId = misc.selectedDestination;
        const selectedRobot = state[robotStatusName].entities[state.map.selectedRobot || ''];
        const { isPlanningRoute } = misc;

        return getIconDataFromDestinations(
            destinations,
            selectedDestinationId,
            selectedRobot?.robotStatus?.currentRoute,
            selectedRobot?.robotStatus?.destination,
            selectedRobot?.robotStatus?.currentDestination,
            isPlanningRoute,
        );
    }
)
