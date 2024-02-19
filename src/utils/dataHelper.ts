import { Position } from '@deck.gl/core/typed';
import { getSite } from 'chayns-api';
import { getColorFromPalette, hexToRgb255 } from '@chayns/colors';
import { MapElementType, TMapElement } from '../types/pudu-api/robotMap';
import { IPathData } from '../types/deckgl-map';
import { CustomDestinationType, DestinationType, TDestination } from '../types/api/destination';
import { TRoute } from '../types/api/route';

// region PathData
/**
 * Maps mapElements of type track and virtual_wall to data that can be used for PathLayer
 * @param elements
 */
export const mapRobotElementsToPathData = (elements: Array<TMapElement>): Array<IPathData> => {
    const pathData: Array<IPathData> = [];
    const { colorMode } = getSite();
    const color = hexToRgb255(
        getColorFromPalette(300, { colorMode }) || '#ffffff'
    ) || { r: 255, g: 255, b: 255 };

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
                color: element.type === MapElementType.track
                    ? [color.r, color.g, color.b]
                    : [157, 0, 0],
                path: [...newVector]
            });
        } else {
            find.path.push(...newVector);
        }
    });

    return pathData;
};

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

// endregion

// region IconData

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
    invalid: boolean,
    routeData: {
        isRouteDestination: boolean,
        isNextDestination: boolean,
        isPreviousDestination: boolean,
        isEarlierDestination: boolean,
        isFinalDestination: boolean,
    },
}

export const getIconDataFromDestinations = (mappedDestinations: TMappedDestination[], selectedDestination?: number, currentRoute?: TRoute, currentDestination?: TDestination, previousDestination?: TDestination) => {
    const indexOfNextDestinationInRoute = currentRoute?.routeDestinations.findIndex(({ destination }) => currentDestination?.id !== undefined && currentDestination?.id === destination?.id) || -1;

    return mappedDestinations
        .map(({ destination, mapElement }) => {
            const indexInRoute = currentRoute?.routeDestinations.findIndex((routeDestination) => routeDestination.destination.id === destination.id);
            const routeDestination = currentRoute?.routeDestinations[indexInRoute || -1];

            return {
                id: destination.id,
                type: destination.type,
                customType: destination.customType,
                mapElementType: mapElement.type,
                mapElementMode: mapElement.mode as MapElementMode,
                name: destination.chaynsUser?.name || destination.name,
                position: mapElement.vector as Position,
                selected: destination.id === selectedDestination,
                invalid: destination.customType !== CustomDestinationType.target,
                routeData: {
                    isRouteDestination: !!routeDestination,
                    isNextDestination: !!currentDestination && routeDestination?.destination.id === currentDestination.id,
                    isPreviousDestination: !!previousDestination && routeDestination?.destination.id === previousDestination?.id,
                    isEarlierDestination: indexOfNextDestinationInRoute > -1 && indexInRoute !== undefined && indexOfNextDestinationInRoute > indexInRoute,
                    isFinalDestination: (currentRoute?.routeDestinations || []).length > 0 && indexInRoute === (currentRoute?.routeDestinations || []).length - 1,
                },
            }
        });
}

// endregion
