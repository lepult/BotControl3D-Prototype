/* eslint-disable no-param-reassign */
import { createReducer, current } from '@reduxjs/toolkit';
import { getAllMapsAction } from './actions';
import { FetchState } from '../../types/fetch';
import { TMap } from '../../types/api/map';

const initialState: {
    fetchState: FetchState,
    entities: { [key: number]: TMap },
    ids: number[],
} = {
    fetchState: FetchState.initial,
    entities: {},
    ids: [],
};


const reducer = createReducer(initialState, (builder) => {
    builder.addCase(getAllMapsAction.pending, (draft) => {
        draft.fetchState = FetchState.pending;
    });
    builder.addCase(getAllMapsAction.rejected, (draft) => {
        draft.fetchState = FetchState.rejected;
    });
    builder.addCase(getAllMapsAction.fulfilled, (draft, {  payload }) => {
        draft.fetchState = FetchState.fulfilled;
        payload.forEach((map) => {
            draft.entities[map.id] = map;
            draft.ids.push(map.id);
        });
        console.log('map draft', current(draft));
    });
});

export default reducer;
