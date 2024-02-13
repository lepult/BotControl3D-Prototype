/* eslint-disable no-fallthrough */
import { pathDataT21OG, pathDataTobitEG, pathDataT22OG, pathDataT12OG, pathDataAtriumDome } from './hardcoded-data/pathData';
import { floorModelsAtriumDome, floorModelsEg, floorModelsT21OG, floorModelsT22OG } from './hardcoded-data/models';
import { TRobotMap } from '../types/pudu-api/robotMap';
import { useProductionBackend } from './env';
import {
    defaultInitialViewState,
    initialViewStateAtriumDome,
    initialViewStateT12OG,
    initialViewStateT21OG,
    initialViewStateT22OG,
    initialViewStateTobitEG
} from './hardcoded-data/initialViewStates';

export const getPathDataByMapId = (mapId: number): TRobotMap | null => {
    if (useProductionBackend) {
        switch (mapId) {
            case 38:
                return pathDataTobitEG;
            case 88:
                return pathDataT21OG;
            case 89:
                return pathDataT22OG;
            case 23:
                return pathDataT12OG;
            case 27:
                return pathDataAtriumDome;
            case 28:
                // return pathDataT11OG;
            default:
                return null;
        }
    } else {
        switch (mapId) {
            case 42:
                return pathDataTobitEG;
            case 52:
                return pathDataT21OG;
            case 51:
                return pathDataT22OG;
            case 16:
                return pathDataT12OG;
            case 32:
                return pathDataAtriumDome;
            case 43:
                // return pathDataT11OG;
            default:
                return null;
        }
    }
};

export const getModelsByMapId = (mapId: number) => {
    if (useProductionBackend) {
        switch (mapId) {
            case 89:
                return floorModelsT22OG;
            case 88:
                return floorModelsT21OG;
            case 27:
                return floorModelsAtriumDome;
            case 38:
                return floorModelsEg;
            case 23:
                // return floorModelsT12OG;
            case 28:
                // return floorModelsT11OG;
            default:
                return [];
        }
    } else {
        switch (mapId) {
            case 51:
                return floorModelsT22OG;
            case 52:
                return floorModelsT21OG;
            case 32:
                return floorModelsAtriumDome;
            case 42:
                return floorModelsEg;
            case 16:
                // return floorModelsT12OG;
            case 43:
                // return floorModelsT11OG;
            default:
                return [];
        }
    }
};

export const getInitialViewStateByMapId = (mapId: number) => {
    if (useProductionBackend) {
        switch (mapId) {
            case 89:
                return initialViewStateT22OG;
            case 88:
                return initialViewStateT21OG;
            case 27:
                return initialViewStateAtriumDome;
            case 38:
                return initialViewStateTobitEG;
            case 23:
                return initialViewStateT12OG;
            case 28:
                // return initialViewStateT11OG;
            default:
                return defaultInitialViewState;
        }
    } else {
        switch (mapId) {
            case 51:
                return initialViewStateT22OG;
            case 52:
                return initialViewStateT21OG;
            case 32:
                return initialViewStateAtriumDome;
            case 42:
                return initialViewStateTobitEG;
            case 16:
                return initialViewStateT12OG;
            case 43:
                // return initialViewStateT11OG;
            default:
                return defaultInitialViewState;
        }
    }
};
