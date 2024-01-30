import { createAction } from '@reduxjs/toolkit';
import { AdminModeType } from '../../types/misc';

type TChangeAdminModeType = {
    adminModeType: AdminModeType,
    editingMapId?: number,
}

type TChangeSelectedDestination = {
    mapId: number,
    destinationName: string,
}

type TChangeIsPlaningRoute = {
    isPlanning: boolean,
}

export const changeAdminModeType = createAction<TChangeAdminModeType>('misc/changeAdminModeType');

export const changeSelectedDestination = createAction<TChangeSelectedDestination | undefined>('misc/changeSelectedDestination');

export const changeIsPlanningRoute = createAction<TChangeIsPlaningRoute>('misc/changeIsPlanningRoute');
