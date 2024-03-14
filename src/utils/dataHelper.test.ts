import {
    trackElements,
    trackPathData,
    virtualWallElements,
    virtualWallPathData,
    nodeElements,
    sourceElements,
    chargingPileElements
} from '../constants/tests/mapRobotElementsToPathData';
import {
    testCurrentDestination,
    testCurrentRoute,
    testMappedDestinations,
    testPreviousDestination,
    testResult
} from '../constants/tests/iconDataFromDestinations';
import {
    mapRobotElementsToPathData,
    getIconDataFromDestinations,
} from './dataHelper';

jest.mock('chayns-api', () => ({
    getSite: jest.fn().mockReturnValue({ colorMode: 2 }),
}));

describe("mapRobotElementsToPathData", () => {
    test('no elements should result in no pathData', () => {
        expect(mapRobotElementsToPathData([])).toStrictEqual([]);
    });

    test('invalid elements should result in no pathData', () => {
        expect(mapRobotElementsToPathData([
            ...nodeElements,
            ...sourceElements,
            ...chargingPileElements,
        ])).toStrictEqual([]);
    });

    test('trackElements should result in trackPathData', () => {
        expect(mapRobotElementsToPathData(trackElements)).toStrictEqual(trackPathData);
    });

    test('virtualWallElements should result in virtualWallPathData', () => {
        expect(mapRobotElementsToPathData(virtualWallElements)).toStrictEqual(virtualWallPathData);
    });

    test('pathElements should result in pathData', () => {
        expect(mapRobotElementsToPathData([
            ...trackElements,
            ...virtualWallElements
        ])).toStrictEqual([
            ...trackPathData,
            ...virtualWallPathData
        ]);
    });

    test('pathElements and invalid elements should result in pathData', () => {
        expect(mapRobotElementsToPathData([
            ...trackElements,
            ...virtualWallElements,
            ...nodeElements,
            ...sourceElements,
            ...chargingPileElements,
        ])).toStrictEqual([
            ...trackPathData,
            ...virtualWallPathData
        ]);
    });
});

describe("getIconDataFromDestinations", () => {
    test('no destinations should result in no iconData', () => {
        expect(getIconDataFromDestinations([])).toStrictEqual([]);
    });
    test('destinations without additional parameters', () => {
        expect(getIconDataFromDestinations(testMappedDestinations)).toStrictEqual(testResult.map((d) => ({
            ...d,
            routeData: {
                isRouteDestination: false,
                isNextDestination: false,
                isPreviousDestination: false,
                isEarlierDestination: false,
                isFinalDestination: false,
            },
        })));
    });

    test('destinations and selected destination', () => {
        const selectedDestination = 951;
        expect(getIconDataFromDestinations(
            testMappedDestinations,
            selectedDestination,
        )).toStrictEqual(testResult.map((d) => ({
            ...d,
            selected: d.id === selectedDestination,
            routeData: {
                isRouteDestination: false,
                isNextDestination: false,
                isPreviousDestination: false,
                isEarlierDestination: false,
                isFinalDestination: false,
            },
        })));
    });

    test('destinations and route', () => {
        expect(getIconDataFromDestinations(
            testMappedDestinations,
            undefined,
            testCurrentRoute,
            testCurrentDestination,
            testPreviousDestination,
        )).toStrictEqual(testResult);
    });

    test('destinations, route and selectedDestination', () => {
        const selectedDestination = 951;
        expect(getIconDataFromDestinations(
            testMappedDestinations,
            selectedDestination,
            testCurrentRoute,
            testCurrentDestination,
            testPreviousDestination,
        )).toStrictEqual(testResult.map((d) => ({
            ...d,
            selected: d.id === selectedDestination,
        })));
    });
});
