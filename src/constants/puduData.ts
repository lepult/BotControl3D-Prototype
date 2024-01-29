import { pathDataT21OG, pathDataTobitEG, pathDataT22OG, pathDataT12OG, pathDataAtriumDome } from './pathData';
import { floorModelsAtriumDome, floorModelsT21OG, floorModelsT22OG } from './models';
import { TRobotMap } from '../types/pudu-api/robotMap';
import { useProductionBackend } from './env';

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
            default:
                return [];
        }
    } else {
        switch (mapId) {
            case 51:
                return floorModelsT22OG;
            case 52:
                return floorModelsT21OG;
            default:
                return [];
        }
    }
}