import { getIconByDestinationType, getIconByMapRobotStatus } from './iconHelper';
import { MapRobotStatus } from '../types/deckgl-map';
import {
    testChargingSvg,
    testIdleSvg,
    testIdleSelectedSvg,
    testTargetIcon,
    testTargetIconData,
    testDiningOutletIcon,
    testDiningOutletIconData
} from '../constants/tests/iconHelper';

describe('getIconByMapRobotStatus', () => {
    test('Charging Status should return Charging svg', () => {
        expect(getIconByMapRobotStatus(MapRobotStatus.Charging, 25, 139, 44)).toBe(testChargingSvg);
    });

    test('Idle Status should return Idle svg', () => {
        expect(getIconByMapRobotStatus(MapRobotStatus.Idle, 25, 139, 44)).toBe(testIdleSvg);
    });

    test('Selected Idle Status should return Selected Idle svg', () => {
        expect(getIconByMapRobotStatus(MapRobotStatus.Idle, 0, 255, 42)).toBe(testIdleSelectedSvg);
    });
});

describe('getIconByDestinationType', () => {
    test('Target should return target icon', () => {
        expect(getIconByDestinationType(testTargetIconData)).toBe(testTargetIcon);
    });

    test('DiningOutlet should return dining outlet icon', () => {
        expect(getIconByDestinationType(testDiningOutletIconData)).toBe(testDiningOutletIcon);
    });
});