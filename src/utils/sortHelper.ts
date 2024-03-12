import { TMapWithDestinations } from '../types/api/map';
import { TDestination } from '../types/api/destination';

// TODO Write tests for this function

export const sortMapsAndDestinations = (maps?: TMapWithDestinations[]) => {
    console.log('maps', maps);
    const sortedMaps = sortMaps(maps);
    const retVal: TMapWithDestinations[] = [];
    sortedMaps?.forEach((map) => {
        const sortedDestinations = sortDestinations(map.destinations);
        retVal.push({ ...map, destinations: sortedDestinations });
    });
    console.log('retVal', retVal);

    return retVal;
};

export const sortMaps = (maps?: TMapWithDestinations[]) => maps?.sort((a, b) => {
    const aName = a.showName ?? a.name;
    const bName = b.showName ?? b.name;

    return aName.localeCompare(bName);
});

export const sortDestinations = (destinations?: TDestination[]) => destinations?.sort((a, b) => a.name.localeCompare(b.name));
