import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllMapsFetch } from '../../api/map/getAllMaps';
import { TViewState } from '../../types/deckgl-map';

type TChangeInitialViewState = {
    mapId: number,
    viewState: TViewState,
}

export const getAllMapsAction = createAsyncThunk(
    'map/getAllMaps',
    async () => getAllMapsFetch(),
);

export const changeInitialViewState = createAction<TChangeInitialViewState>('map/changeInitialViewState');
