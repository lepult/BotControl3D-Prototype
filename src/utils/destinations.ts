import { TMapElement } from '../types/pudu-api/robotMap';
import { TDestination } from '../types/api/destination';

const findDestinationInMapData = (filteredMapData?: TMapElement[], destination?: TDestination) => filteredMapData?.find((element) => element.name === destination?.name || element.id === destination?.name);
export const findMapElementInDestinations = (mapElement: TMapElement, destinations?: Array<TDestination>) => destinations?.find((destination) => destination.name === mapElement.name || destination.name === mapElement.id);