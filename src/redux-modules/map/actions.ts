import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllMapsFetch } from '../../api/map/getAllMaps';
import { TViewState } from '../../types/deckgl-map';

type TChangeInitialViewState = {
    mapId: number,
    viewState: TViewState,
}

type TChangeSelectedMap = {
    mapId: number,
}

type TToggleSelectedRobot = {
    robotId: string | undefined,
}

type TSetFollowRobot = {
    followRobot: boolean,
}

export const getAllMapsAction = createAsyncThunk(
    'map/getAllMaps',
    async () => getAllMapsFetch(),
);

export const changeInitialViewState = createAction<TChangeInitialViewState>('map/changeInitialViewState');

export const changeSelectedMap = createAction<TChangeSelectedMap>('map/changeSelectedMap');

export const toggleSelectedRobot = createAction<TToggleSelectedRobot>('map/toggleSelectedRobot')

export const toggleFollowRobot = createAction('map/toggleFollowRobot')
export const setFollowRobot = createAction<TSetFollowRobot>('map/setFollowRobot')
