/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit';
import { AdminModeType } from '../../types/misc';
import { changeAdminModeType, changeSelectedDestination } from './actions';

const initialState: {
    adminModeType: AdminModeType,
    editingMapId: number | undefined,
    selectedDestination: {
        mapId: number,
        destinationId: number,
        name: string,
    } | undefined,
} = {
    adminModeType: AdminModeType.default,
    editingMapId: undefined,
    selectedDestination: undefined,
};

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(changeAdminModeType, (draft, { payload }) => {
        draft.adminModeType = payload.adminModeType;
        draft.editingMapId = payload.editingMapId || draft.editingMapId;
    });

    builder.addCase(changeSelectedDestination, (draft, { payload }) => {
        draft.selectedDestination = payload;
    });
});

export default reducer;
