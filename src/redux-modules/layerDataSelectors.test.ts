/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getRobotLayerData, selectDestinationsLayerData } from './layerDataSelectors';
import {
    testRobotLayerDataResult1,
    testRobotLayerDataRobot,
    testRobotLayerDataResult2
} from '../constants/tests/getRobotLayerData';
import {
    testDestinationsLayerDataResult,
    testDestinationsLayerDataStore
} from '../constants/tests/selectDestinationsLayerData';

describe('selectDestinationsLayerData', () => {
    test('Using Redux State should result in IconData', () => {
        // @ts-ignore
        expect(selectDestinationsLayerData(testDestinationsLayerDataStore, 27)).toStrictEqual(testDestinationsLayerDataResult);
    })
});

describe('getRobotLayerData', () => {
    test('Robot should result in RobotLayerData Item', () => {
        // @ts-ignore
        expect(getRobotLayerData(testRobotLayerDataRobot, '2050e70224d4')).toStrictEqual(testRobotLayerDataResult1);
    });

    test('Selected Robot should result in selected RobotLayerData Item', () => {
        // @ts-ignore
        expect(getRobotLayerData(testRobotLayerDataRobot, '08e9f609e97a')).toStrictEqual(testRobotLayerDataResult2);
    });
});