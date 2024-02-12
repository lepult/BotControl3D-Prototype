/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit';
import {
    changeInitialViewState,
    changeSelectedMap,
    toggleSelectedRobot,
    getAllMapsAction,
    toggleFollowRobot, setFollowRobot
} from './actions';
import { FetchState } from '../../types/fetch';
import { TMap } from '../../types/api/map';
import { TViewState } from '../../types/deckgl-map';
import { getInitialViewStateByMapId, getPathDataByMapId } from '../../constants/getMapData';

const initialState: {
    fetchState: FetchState,
    entities: { [key: number]: TMap },
    ids: number[],
    initialViewStateById: { [key: number]: TViewState },
    selectedMap?: number,
    selectedRobot?: string,
    followRobot: boolean,
} = {
    fetchState: FetchState.initial,
    entities: {},
    ids: [],
    initialViewStateById: {},
    selectedMap: undefined,
    selectedRobot: undefined,
    followRobot: false,
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
                draft.initialViewStateById[map.id] = getInitialViewStateByMapId(map.id);
            }
        });

        draft.selectedMap = payload.find((map) => !map.hidden && getPathDataByMapId(map.id))?.id;
    });

    builder.addCase(changeInitialViewState, (draft, { payload }) => {
        draft.initialViewStateById[payload.mapId] = payload.viewState;
    });

    builder.addCase(changeSelectedMap, (draft, { payload }) => ({
        ...draft,
        selectedMap: payload.mapId,
    }));

    builder.addCase(toggleSelectedRobot, (draft, { payload }) => ({
        ...draft,
        selectedRobot: payload.robotId === draft.selectedRobot
            ? undefined
            : payload.robotId,
        followRobot: payload.robotId === draft.selectedRobot
            ? false
            : draft.followRobot,
    }));

    builder.addCase(toggleFollowRobot, (draft) => ({
        ...draft,
        followRobot: !draft.followRobot,
    }));

    builder.addCase(setFollowRobot, (draft, { payload }) => ({
        ...draft,
        followRobot: payload.followRobot,
    }));
});

export default reducer;
