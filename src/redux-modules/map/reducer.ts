/* eslint-disable no-param-reassign */
import { createReducer, current } from '@reduxjs/toolkit';
import { changeInitialViewState, changeSelectedMap, getAllMapsAction } from './actions';
import { FetchState } from '../../types/fetch';
import { TMap } from '../../types/api/map';
import { TViewState } from '../../types/deckgl-map';
import { INITIAL_VIEW_STATE } from '../../constants/deckGl';
import { getPathDataByMapId } from '../../constants/puduData';

const initialState: {
    fetchState: FetchState,
    entities: { [key: number]: TMap },
    ids: number[],
    initialViewStateById: { [key: number]: TViewState },
    selectedMap?: number,
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
        },
        23: {
            bearing: -92.27603943420489,
            latitude: 0.00007468137389339414,
            longitude: 0.000046934286567453376,
            pitch: 0,
            zoom: 21.900260063435525,
        },
        88: {
            bearing: 1.0801543077582512,
            latitude: 0.00003415108335180374,
            longitude: 0.0001394576258052846,
            pitch: 0,
            zoom: 21.861244231311016,
        }
    },
    selectedMap: undefined,
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

        // draft.selectedMap = payload.find((map) => !map.hidden && getPathDataByMapId(map.id))?.id;
        draft.selectedMap = 51;
    });

    builder.addCase(changeInitialViewState, (draft, { payload }) => {
        draft.initialViewStateById[payload.mapId] = payload.viewState;
    });

    builder.addCase(changeSelectedMap, (draft, { payload }) => ({
        ...draft,
        selectedMap: payload.mapId,
    }));
});

export default reducer;
