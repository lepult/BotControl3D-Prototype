import { RootState } from '../index';

export const selectAdminModeType = (state: RootState) => state.misc.adminModeType;

export const selectEditingMapId = (state: RootState) => state.misc.editingMapId;

export const selectSelectedDestinationId = (state: RootState) => state.misc.selectedDestination;
export const selectSelectedDestination = (state: RootState) => state.destination.entities[state.misc.selectedDestination || -1];

export const selectIsPlanningRoute = (state: RootState) => state.misc.isPlanningRoute;

export const selectResetViewState = (state: RootState) => state.misc.resetViewState;
