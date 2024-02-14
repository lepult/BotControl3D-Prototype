import { createAction } from '@reduxjs/toolkit';

type TChangeIsPlanningRoute = {
    isPlanning: boolean,
    unselectDestination?: boolean,
}

export const changeSelectedDestination = createAction<number | undefined>('misc/changeSelectedDestination');
export const toggleSelectedDestination = createAction<number>('misc/toggleSelectedDestination');

export const changeIsPlanningRoute = createAction<TChangeIsPlanningRoute>('misc/changeIsPlanningRoute');

export const resetViewState = createAction('misc/resetViewState');

export const setIsEditingMap = createAction<boolean>('misc/setIsEditingMap');
