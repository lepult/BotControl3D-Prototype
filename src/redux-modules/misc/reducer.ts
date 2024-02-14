/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit';
import {
    changeIsPlanningRoute,
    changeSelectedDestination,
    resetViewState, setIsEditingMap,
    toggleSelectedDestination
} from './actions';

const initialState: {
    selectedDestination: number | undefined,
    isPlanningRoute: boolean,
    resetViewState: number,
    isEditingMap: boolean
} = {
    selectedDestination: undefined,
    isPlanningRoute: false,
    resetViewState: 0,
    isEditingMap: false,
};

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(changeSelectedDestination, (draft, { payload }) => {
        draft.selectedDestination = payload;
    });

    builder.addCase(toggleSelectedDestination, (draft, { payload }) => {
        if (payload === draft.selectedDestination) {
            draft.selectedDestination = undefined;
        } else {
            draft.selectedDestination = payload;
        }
    })

    builder.addCase(changeIsPlanningRoute, (draft, { payload }) => {
        if (payload.unselectDestination) {
            draft.selectedDestination = undefined;
        }
        draft.isPlanningRoute = payload.isPlanning;
    });

    builder.addCase(resetViewState, (draft) => {
        draft.resetViewState++;
    });

    builder.addCase(setIsEditingMap, (draft, { payload }) => {
        draft.isEditingMap = payload;
    })
});

export default reducer;
