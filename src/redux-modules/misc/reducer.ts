/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit';
import { AdminModeType } from '../../types/misc';
import { changeAdminModeType, changeIsPlanningRoute, changeSelectedDestination, resetViewState } from './actions';

const initialState: {
    adminModeType: AdminModeType,
    editingMapId: number | undefined,
    selectedDestination: number | undefined,
    isPlanningRoute: boolean,
    resetViewState: number,
} = {
    adminModeType: AdminModeType.default,
    editingMapId: undefined,
    selectedDestination: undefined,
    isPlanningRoute: false,
    resetViewState: 0,
};

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(changeAdminModeType, (draft, { payload }) => {
        draft.adminModeType = payload.adminModeType;
        draft.editingMapId = payload.editingMapId || draft.editingMapId;
    });

    builder.addCase(changeSelectedDestination, (draft, { payload }) => {
        draft.selectedDestination = payload;
    });

    builder.addCase(changeIsPlanningRoute, (draft, { payload }) => {
        if (payload.unselectDestination) {
            draft.selectedDestination = undefined;
        }
        draft.isPlanningRoute = payload.isPlanning;
    });

    builder.addCase(resetViewState, (draft) => {
        draft.resetViewState++;
    });
});

export default reducer;
