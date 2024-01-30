import { RootState } from '../index';

export const selectAdminModeType = (state: RootState) => state.misc.adminModeType;
export const selectEditingMapId = (state: RootState) => state.misc.editingMapId;

export const selectSelectedDestination = (state: RootState) => state.misc.selectedDestination;

export const selectSelectedDestinationByMapId = (mapId: number) => (state: RootState) => state.misc.selectedDestination?.mapId === mapId
    ? state.misc.selectedDestination
    : undefined;

export const selectIsPlanningRoute = (state: RootState) => state.misc.isPlanningRoute;
