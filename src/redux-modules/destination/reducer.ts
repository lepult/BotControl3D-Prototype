/* eslint-disable no-param-reassign */
import { createReducer, current } from '@reduxjs/toolkit';
import { getAllDestinationsAction } from './actions';
import { FetchState } from '../../types/fetch';
import { TDestination } from '../../types/api/destination';

const initialState: {
    fetchState: FetchState,
    entities: { [key: number]: TDestination },
    ids: number[],
    idsByCustomType: { [key: string]: number[] },
    idsByMapId: { [key: number]: number[] },
} = {
    fetchState: FetchState.initial,
    entities: {},
    ids: [],
    idsByCustomType: {},
    idsByMapId: {},
};

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(getAllDestinationsAction.pending, (draft) => {
        draft.fetchState = FetchState.pending;
    });
    builder.addCase(getAllDestinationsAction.rejected, (draft) => {
        draft.fetchState = FetchState.rejected;
    });
    builder.addCase(getAllDestinationsAction.fulfilled, (draft, {  payload }) => {
        draft.fetchState = FetchState.fulfilled;
        payload.forEach((destination) => {
            draft.entities[destination.id] = destination;

            if (destination.customType) {
                if (!draft.idsByCustomType[destination.customType]) {
                    draft.idsByCustomType[destination.customType] = [];
                }
                draft.idsByCustomType[destination.customType].push(destination.id);
            }

            if (!draft.idsByMapId[destination.mapId]) {
                draft.idsByMapId[destination.mapId] = [];
            }
            draft.idsByMapId[destination.mapId].push(destination.id);

            draft.ids.push(destination.id)

        });
        console.log('draft', current(draft));
    });
});

export default reducer;