/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit';
import { AdminModeType } from '../../types/misc';
import { changeAdminModeType } from './actions';

const initialState: {
    adminModeType: AdminModeType,
    editingMapId: number | undefined,
} = {
    adminModeType: AdminModeType.default,
    editingMapId: undefined,
};

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(changeAdminModeType, (draft, { payload }) => {
        draft.adminModeType = payload.adminModeType;
        draft.editingMapId = payload.editingMapId || draft.editingMapId;
    });
});

export default reducer;
