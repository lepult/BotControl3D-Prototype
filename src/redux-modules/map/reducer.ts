/* eslint-disable no-param-reassign */
import { createReducer, current } from '@reduxjs/toolkit';
import { changeInitialViewState, getAllMapsAction } from './actions';
import { FetchState } from '../../types/fetch';
import { TMap } from '../../types/api/map';
import { TViewState } from '../../types/deckgl-map';
import { INITIAL_VIEW_STATE } from '../../constants/deckGl';

const initialState: {
    fetchState: FetchState,
    entities: { [key: number]: TMap },
    ids: number[],
    initialViewStateById: { [key: number]: TViewState }
} = {
    fetchState: FetchState.initial,
    entities: {},
    ids: [],
    initialViewStateById: {
        38: {
            bearing: -85.27521631707897,
            latitude: -0.0005164795919139631,
            longitude: 0.00004710016333342206,
            pitch: 0,
            zoom: 20.01178480525776,
        },
        89: {
            bearing: 4.945054945054945,
            latitude: 0.00003942584642706234,
            longitude: 0.00014383500909172006,
            pitch: 0,
            zoom: 21.72801121717332,
        }
    },
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
            if (!draft.initialViewStateById[map.id]) {
                draft.initialViewStateById[map.id] = {
                    bearing: INITIAL_VIEW_STATE.bearing,
                    latitude: INITIAL_VIEW_STATE.latitude,
                    longitude: INITIAL_VIEW_STATE.longitude,
                    pitch: INITIAL_VIEW_STATE.pitch,
                    zoom: INITIAL_VIEW_STATE.zoom,
                };
            }
        });
        console.log('map draft', current(draft));
    });

    builder.addCase(changeInitialViewState, (draft, { payload }) => {
        draft.initialViewStateById[payload.mapId] = payload.viewState;
    });
});

export default reducer;
