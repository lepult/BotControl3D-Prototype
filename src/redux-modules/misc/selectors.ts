import { RootState } from '../index';

export const selectAdminModeType = (state: RootState) => state.misc.adminModeType;
export const selectEditingMapId = (state: RootState) => state.misc.editingMapId;