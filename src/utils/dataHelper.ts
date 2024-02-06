import { Position } from '@deck.gl/core/typed';
import { MapElementType, TMapElement } from '../types/pudu-api/robotMap';
import { IPathData } from '../types/deckgl-map';
import { CustomDestinationType, DestinationType, TDestination } from '../types/api/destination';
import { TRoute, TRouteDestination } from '../types/api/route';
import { findMapElementInDestinations } from './destinations';

// region PathData
/**
 * Maps mapElements of type track and virtual_wall to data that can be used for PathLayer
 * @param elements
 */
export const mapRobotElementsToPathData = (elements: Array<TMapElement>): Array<IPathData> => {
    const pathData: Array<IPathData> = [];
    elements.forEach((element) => {
        if (element.type !== MapElementType.track && element.type !== MapElementType.virtualWall)
            return;

        // Elements with the same id are connected lines
        // Add vector to other element, if they have the same id
        const find = pathData.find((d) => d.id === element.id && d.type === element.type);

        // insertTokenEveryN is used to move all paths up by <token> units, by adding <token> as a Z-coordinate into the XY-Array.
        const newVector = insertTokenEveryN(element.vector, 0.1, 2, false);
        if (!find) {
            pathData.push({
                id: element.id,
                type: element.type,
                name: typeof element.name === 'string' ? element.name : element.id,
                color: element.type === MapElementType.track ? [255, 255, 255] : [157, 0, 0],
                path: [...newVector]
            });
        } else {
            find.path.push(...newVector);
        }
    });

    return pathData;
};
// endregion

const insertTokenEveryN = (array: number[], token: number, n: number, fromEnd: boolean) => {
    const a = array.slice(0);

    // Insert the <token> every <n> elements.

    let idx = fromEnd ? a.length - n : n;

    while ((fromEnd ? idx >= 1 : idx <= a.length))
    {
        a.splice(idx, 0, token);
        idx = (fromEnd  ? idx - n : idx + n + 1);
    }

    return a;
};

type TMappedDestination = {
    destination: TDestination,
    mapElement: TMapElement,
}

type MapElementMode = 'table' | 'dining_outlet' | 'transit' | 'dishwashing' | 'parking' | string;

export type IIconData = {
    id: number,
    type: DestinationType,
    customType: CustomDestinationType,
    mapElementType: MapElementType,
    mapElementMode: MapElementMode,
    name: string,
    position: Position,
    selected: boolean,
    routeData: {
        isRouteDestination: boolean,
        isNextDestination: boolean,
        isPreviousDestination: boolean,
        isEarlierDestination: boolean,
        isFinalDestination: boolean,
    },
}

export const getIconDataFromDestinations = (mappedDestinations: TMappedDestination[], selectedDestination?: number) => {
    const iconData = mappedDestinations
        .map(({ destination, mapElement }) => ({
            id: destination.id,
            type: destination.type,
            customType: destination.customType,
            mapElementType: mapElement.type,
            mapElementMode: mapElement.mode as MapElementMode,
            name: destination.chaynsUser?.name || destination.name,
            position: mapElement.vector as Position,
            selected: destination.id === selectedDestination,
            routeData: {
                isRouteDestination: false,
                isNextDestination: false,
                isPreviousDestination: false,
                isEarlierDestination: false,
                isFinalDestination: false,
            },
        }));
    return iconData;
}

// region IconData
/**
 * Maps mapElements of type source and charging_pile to data that can be used for IconLayer
 * @param elements
 * @param selectedDestination
 * @param currentRoute
 * @param mapId
 * @param currentDestination
 * @param previousDestination
 */
export const mapRobotElementsToIconData = (elements: Array<TMapElement>, selectedDestination?: string, currentRoute?: TRoute, mapId?: number, currentDestination?: TDestination, previousDestination?: TDestination, destinations?: TDestination[]): Array<IIconData> => {
    const iconData: Array<IIconData> = [];

    const indexOfNextDestinationInRoute = currentRoute?.routeDestinations.findIndex(({ destination }) => currentDestination?.id !== undefined && currentDestination?.id === destination?.id) || -1;

    elements.forEach((element) => {
        if (element.type === MapElementType.source || element.type === MapElementType.chargingPile) {
            const position: Position = [element.vector[0], element.vector[1]];

            // Calculate name of element
            // let name = element.name && typeof element.name === 'string' ? element.name : element.id;
            // const destination = findMapElementInDestinations(element, destinations);
            // if (destination) {
            //     const destinationName = getDestinationName(destination);
            //     // Use destination name, if it is different from the name of the element
            //     name = destinationName !== undefined && destinationName !== name ? `${destinationName} (${name})` : name;
            // }

            const indexInRoute = currentRoute?.routeDestinations.findIndex(({ destination }) => (element.name === destination?.name || element.id === destination?.name) && mapId === destination.mapId);
            const routeDestination = currentRoute?.routeDestinations[indexInRoute === undefined ? -1 : indexInRoute];
            const destination = findMapElementInDestinations(element, destinations);

            iconData.push({
                ...element,
                name: '',
                // name,
                position,
                color: element.mode === DestinationType.diningOutlet || element.type === MapElementType.chargingPile
                    ? [0, 255, 0]
                    : [0, 0, 255],
                selected: element.id === selectedDestination,
                routeData: {
                    isRouteDestination: !!routeDestination,
                    isNextDestination: !!currentDestination && routeDestination?.destination.id === currentDestination.id,
                    isPreviousDestination: !!previousDestination && routeDestination?.destination.id === previousDestination?.id,
                    isEarlierDestination: indexOfNextDestinationInRoute > -1 && indexInRoute !== undefined && indexOfNextDestinationInRoute > indexInRoute,
                    isFinalDestination: (currentRoute?.routeDestinations || []).length > 0 && indexInRoute === (currentRoute?.routeDestinations || []).length - 1,
                },
                customType: destination?.customType,
            });
        }
    });

    return iconData;
};
// endregion
