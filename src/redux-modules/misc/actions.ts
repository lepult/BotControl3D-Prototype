import { createAction } from '@reduxjs/toolkit';
import { AdminModeType } from '../../types/misc';

type TChangeAdminModeType = {
    adminModeType: AdminModeType,
    editingMapId?: number,
}

type TChangeSelectedDestination = {
    mapId: number,
    destinationId: number,
    name: string,
}

export const changeAdminModeType = createAction<TChangeAdminModeType>('misc/changeAdminModeType');

export const changeSelectedDestination = createAction<TChangeSelectedDestination | undefined>('misc/changeSelectedDestination');
