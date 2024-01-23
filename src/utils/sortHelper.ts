// region Imports
import { TMapWithDestinations } from '../types/api/map';
import { TSelectMap } from '../types/websocket/syncMapsData';
import { TDestination } from '../types/api/destination';
// endregion

export const sortMapsAndDestinations = (maps?: TMapWithDestinations[]) => {
    const sortedMaps = sortMaps(maps);
    const retVal: TMapWithDestinations[] = [];
    sortedMaps?.forEach((map) => {
        const sortedDestinations = sortDestinations(map.destinations);
        retVal.push({ ...map, destinations: sortedDestinations });
    });

    return retVal;
};

export const sortMaps = (maps?: TMapWithDestinations[]) => maps?.sort((a, b) => {
    const aName = a.showName ?? a.name;
    const bName = b.showName ?? b.name;

    return aName.localeCompare(bName);
});

export const sortSelectMaps = (maps: TSelectMap[]) => maps.sort((a, b) => a.showName.localeCompare(b.showName));

export const sortDestinations = (destinations?: TDestination[]) => destinations?.sort((a, b) => a.name.localeCompare(b.name));
