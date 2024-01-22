import { createAction } from '@reduxjs/toolkit';
import { AdminModeType } from '../../types/misc';

type TChangeAdminModeType = {
    adminModeType: AdminModeType,
    editingMapId?: number,
}

export const changeAdminModeType = createAction<TChangeAdminModeType>('misc/changeAdminModeType')
