import { RootState } from '../index';

export const selectSelectedDestinationId = (state: RootState) => state.misc.selectedDestination;
export const selectSelectedDestination = (state: RootState) => state.destination.entities[state.misc.selectedDestination || -1];

export const selectIsPlanningRoute = (state: RootState) => state.misc.isPlanningRoute;

export const selectResetViewState = (state: RootState) => state.misc.resetViewState;

export const selectIsEditingMap = (state: RootState) => state.misc.isEditingMap;
