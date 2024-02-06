/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit';
import { getAllDestinationsAction } from './actions';
import { FetchState } from '../../types/fetch';
import { TDestination } from '../../types/api/destination';
import { getPathDataByMapId } from '../../constants/puduData';
import { MapElementType, TMapElement } from '../../types/pudu-api/robotMap';

const initialState: {
    fetchState: FetchState,
    entities: {
        [key: number]: {
            destination: TDestination,
            mapElement: TMapElement
        }
    },
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
        const allMapIds = [...new Set(payload.map((destination) => destination.mapId))];
        console.log('allMapIds', allMapIds);
        const mapElementsByMapId: {
            [key: number]: TMapElement[],
        } = {};
        allMapIds.forEach((mapId) => {
            mapElementsByMapId[mapId] = (getPathDataByMapId(mapId)?.elements || [])
                .filter((element) => [
                    MapElementType.source,
                    MapElementType.chargingPile
                ].includes(element.type as MapElementType));
        });
        console.log('mapElementsByMapId', mapElementsByMapId);
        const test = [];
        payload.forEach((destination) => {
            const mapElement = mapElementsByMapId[destination.mapId]
                .find((element) => element.name === destination.name || element.id === destination.name);
            if (!mapElement) {
                test.push(destination);
            }
        });

        payload.forEach((destination) => {
            const mapElement = mapElementsByMapId[destination.mapId]
                .find((element) => element.name === destination.name || element.id === destination.name);
            if (!mapElement) {
                return;
            }

            draft.entities[destination.id] = {
                destination,
                mapElement,
            };

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
    });
});

export default reducer;