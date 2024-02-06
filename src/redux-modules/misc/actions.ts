import { createAction } from '@reduxjs/toolkit';
import { AdminModeType } from '../../types/misc';

type TChangeAdminModeType = {
    adminModeType: AdminModeType,
    editingMapId?: number,
}

type TChangeIsPlanningRoute = {
    isPlanning: boolean,
}

export const changeAdminModeType = createAction<TChangeAdminModeType>('misc/changeAdminModeType');

export const changeSelectedDestination = createAction<number | undefined>('misc/changeSelectedDestination');

export const changeIsPlanningRoute = createAction<TChangeIsPlanningRoute>('misc/changeIsPlanningRoute');

export const resetViewState = createAction('misc/resetViewState');
