import { pathDataT21OG, pathDataTobitEG, pathDataTobitT22OG } from './pathData';
import { floorModelsT22OG } from './models';

export const getPathDataByMapId = (mapId: number) => {
    switch (mapId) {
        case 38:
            return pathDataTobitEG;
        case 88:
            return pathDataT21OG;
        case 89:
            return pathDataTobitT22OG;
        default:
            return pathDataT21OG;
    }
};

export const getModelsByMapId = (mapId: number) => {
    switch (mapId) {
        case 89:
            return floorModelsT22OG;
        default:
            return [];
    }
}