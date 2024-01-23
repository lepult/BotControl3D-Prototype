import { Position } from '@deck.gl/core/typed';
import { MapElementType, TMapElement } from '../types/pudu-api/robotMap';
import { IIconData, IPathData } from '../types/deckgl-map';
import { DestinationType, TDestination } from '../types/api/destination';

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
        const newVector = insertTokenEveryN(element.vector, 0.1, 2, false);
        if (!find) {
            pathData.push({
                id: element.id,
                type: element.type,
                name: typeof element.name === 'string' ? element.name : element.id,
                color: element.type === MapElementType.track ? [255, 0, 0] : [0, 0, 255],
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
    // Clone the received array, so we don't mutate the
    // original one. You can ignore this if you don't mind.

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

// region IconData
/**
 * Maps mapElements of type source and charging_pile to data that can be used for IconLayer
 * @param elements
 * @param destinations
 */
export const mapRobotElementsToIconData = (elements: Array<TMapElement>, selectedDestination?: string): Array<IIconData> => {
    const iconData: Array<IIconData> = [];
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

            iconData.push({
                ...element,
                name: '',
                // name,
                position,
                color: element.mode === DestinationType.diningOutlet || element.type === MapElementType.chargingPile
                    ? [0, 255, 0]
                    : [0, 0, 255],
                selected: element.id === selectedDestination,
            });
        }
    });

    return iconData;
};
// endregion
