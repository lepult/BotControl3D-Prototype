import { pathDataT21OG, pathDataTobitEG, pathDataT22OG, pathDataT12OG } from './pathData';
import { floorModelsT22OG } from './models';
import { TRobotMap } from '../types/pudu-api/robotMap';

export const getPathDataByMapId = (mapId: number): TRobotMap | null => {
    switch (mapId) {
        case 38:
        case 42:
            return pathDataTobitEG;
        case 88:
        case 52:
            return pathDataT21OG;
        case 89:
        case 51:
            return pathDataT22OG;
        case 23:
        case 16:
            return pathDataT12OG;
        case 28:
        case 43:
            // return pathDataT11OG;
        default:
            return null;
    }
};

export const getModelsByMapId = (mapId: number) => {
    switch (mapId) {
        case 89:
        case 51:
            return floorModelsT22OG;
        default:
            return [];
    }
}