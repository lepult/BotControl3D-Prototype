/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getMapRobotStatus } from './robotStatusHelper';
import { MapRobotStatus } from '../types/deckgl-map';
import { RobotActivity } from '../constants/enums/robotActivity';

describe('getMapRobotStatus', () => {
    test('no puduStatus should result in Offline', () => {
        expect(getMapRobotStatus(undefined, undefined)).toBe(MapRobotStatus.Offline)
        expect(getMapRobotStatus({ robotId: '', state: 'Idle' }, undefined)).toBe(MapRobotStatus.Offline)
    });

    test('puduStatus moveState === "Error" and no robotStatus should result in Error', () => {
        expect(getMapRobotStatus(undefined, {
            chargeStage: 'idle',
            moveState: 'Error',
        })).toBe(MapRobotStatus.Error)
        expect(getMapRobotStatus(undefined, {
            chargeStage: 'idle',
            // @ts-ignore
            moveState: 'error',
        })).toBe(MapRobotStatus.Error)
        // @ts-ignore
        expect(getMapRobotStatus(undefined, {
            chargeStage: 'idle',
            // @ts-ignore
            moveState: 'ERROR',
        })).toBe(MapRobotStatus.Error)
    });

    test('puduStatus chargeStage === "Idle" and no robotStatus should result in Offline', () => {
        expect(getMapRobotStatus(undefined, { chargeStage: 'idle' })).toBe(MapRobotStatus.Offline)
        expect(getMapRobotStatus(undefined, { chargeStage: 'Idle' })).toBe(MapRobotStatus.Offline)
        expect(getMapRobotStatus(undefined, { chargeStage: 'IDLE' })).toBe(MapRobotStatus.Offline)
    });

    test('puduStatus with invalid chargeState and no robotStatus should result in Offline', () => {
        expect(getMapRobotStatus(undefined, { chargeStage: 'lol' })).toBe(MapRobotStatus.Offline)
    });

    test('puduStatus with valid chargeState and no robotStatus should result in Charged, Idle, Charging or ChargingError', () => {
        expect(getMapRobotStatus(undefined, { chargeStage: 'Charge Full' })).toBe(MapRobotStatus.Charged)
        expect(getMapRobotStatus(undefined, { chargeStage: 'ChargeFull' })).toBe(MapRobotStatus.Charged)
        expect(getMapRobotStatus(undefined, { chargeStage: 'StopCharge' })).toBe(MapRobotStatus.Idle)
        expect(getMapRobotStatus(undefined, { chargeStage: 'Charging' })).toBe(MapRobotStatus.Charging)
        expect(getMapRobotStatus(undefined, { chargeStage: 'Charing' })).toBe(MapRobotStatus.Charging)
        expect(getMapRobotStatus(undefined, { chargeStage: 'Error' })).toBe(MapRobotStatus.ChargingError)
    });

    test('robotStatus idle and puduStatus is not, should result in puduStatus', () => {
        expect(getMapRobotStatus({
            robotId: '',
            state: 'Idle'
        }, {
            robotState: 'Busy',
            chargeStage: 'Charging'
        })).toBe(MapRobotStatus.Charging);
    });

    test('robotStatus idle, should result in puduStatus', () => {
        expect(getMapRobotStatus({ robotId: '', state: 'Idle' }, { robotState: 'Busy', })).toBe(MapRobotStatus.Idle);
        expect(getMapRobotStatus({ robotId: '', state: 'Idle' }, {})).toBe(MapRobotStatus.Idle);
    });

    test('robotStatus is not idle should result in corresponding MapRobotStatus', () => {
        // @ts-ignore
        expect(getMapRobotStatus({ robotId: '', state: 'Charge Full' }, {})).toBe(MapRobotStatus.Charged);
        // @ts-ignore
        expect(getMapRobotStatus({ robotId: '', state: 'ChargeFull' }, {})).toBe(MapRobotStatus.Charged);
        // @ts-ignore
        expect(getMapRobotStatus({ robotId: '', state: 'StopCharge' }, {})).toBe(MapRobotStatus.Idle);
        // @ts-ignore
        expect(getMapRobotStatus({ robotId: '', state: 'Charging' }, {})).toBe(MapRobotStatus.Charging);
        // @ts-ignore
        expect(getMapRobotStatus({ robotId: '', state: 'Charing' }, {})).toBe(MapRobotStatus.Charging);

        expect(getMapRobotStatus({ robotId: '', state: 'ArrivedAtDiningOutlet' }, {})).toBe(MapRobotStatus.ArrivedAtDiningOutlet);
        expect(getMapRobotStatus({ robotId: '', state: 'ArrivedAtPickupDestination' }, {})).toBe(MapRobotStatus.ArrivedAtPickupDestination);
        expect(getMapRobotStatus({ robotId: '', state: 'OpeningDoor' }, {})).toBe(MapRobotStatus.WaitForDoor);
        expect(getMapRobotStatus({ robotId: '', state: 'ClosingDoor' }, {})).toBe(MapRobotStatus.WaitForDoor);
        expect(getMapRobotStatus({ robotId: '', state: 'WaitForElevator' }, {})).toBe(MapRobotStatus.WaitForElevator);
        expect(getMapRobotStatus({ robotId: '', state: 'MovingWithElevator' }, {})).toBe(MapRobotStatus.MovingWithElevator);
        expect(getMapRobotStatus({ robotId: '', state: 'SendToChargingPile' }, {})).toBe(MapRobotStatus.SendToChargingPile);
        expect(getMapRobotStatus({ robotId: '', state: 'PrepareDriveToDestination' }, {})).toBe(MapRobotStatus.PrepareDriveToDestination);
        expect(getMapRobotStatus({ robotId: '', state: 'Idle' }, {})).toBe(MapRobotStatus.Idle);
        expect(getMapRobotStatus({ robotId: '', state: 'Pause' }, {})).toBe(MapRobotStatus.Pause);
        expect(getMapRobotStatus({ robotId: '', state: 'Avoid' }, {})).toBe(MapRobotStatus.Avoid);

        expect(getMapRobotStatus({ robotId: '', state: 'Moving', currentActivity: RobotActivity.SendToCharge }, {})).toBe(MapRobotStatus.SendToChargingPile);
        expect(getMapRobotStatus({ robotId: '', state: 'Approaching', currentActivity: RobotActivity.SendToCharge }, {})).toBe(MapRobotStatus.SendToChargingPile);
        expect(getMapRobotStatus({ robotId: '', state: 'Arriving', currentActivity: RobotActivity.SendToCharge }, {})).toBe(MapRobotStatus.SendToChargingPile);
        expect(getMapRobotStatus({ robotId: '', state: 'Moving' }, {})).toBe(MapRobotStatus.SendToDestination);
        expect(getMapRobotStatus({ robotId: '', state: 'Approaching' }, {})).toBe(MapRobotStatus.SendToDestination);
        expect(getMapRobotStatus({ robotId: '', state: 'Arriving' }, {})).toBe(MapRobotStatus.SendToDestination);

        expect(getMapRobotStatus({ robotId: '', state: 'Arrived', currentActivity: RobotActivity.SendToCharge }, {})).toBe(MapRobotStatus.SendToChargingPile);
        expect(getMapRobotStatus({ robotId: '', state: 'Arrive', currentActivity: RobotActivity.SendToCharge }, {})).toBe(MapRobotStatus.SendToChargingPile);
        expect(getMapRobotStatus({ robotId: '', state: 'Arrived' }, {})).toBe(MapRobotStatus.ArrivedAtDestination);
        expect(getMapRobotStatus({ robotId: '', state: 'Arrive' }, {})).toBe(MapRobotStatus.ArrivedAtDestination);

        expect(getMapRobotStatus({ robotId: '', state: 'Stuck' }, {})).toBe(MapRobotStatus.Blocked);
        expect(getMapRobotStatus({ robotId: '', state: 'KeepAside' }, {})).toBe(MapRobotStatus.Blocked);
        expect(getMapRobotStatus({ robotId: '', state: 'WaitAside' }, {})).toBe(MapRobotStatus.Blocked);
        expect(getMapRobotStatus({ robotId: '', state: 'MoveBack' }, {})).toBe(MapRobotStatus.Blocked);
        expect(getMapRobotStatus({ robotId: '', state: 'Cancel' }, {})).toBe(MapRobotStatus.Cancel);
        expect(getMapRobotStatus({ robotId: '', state: 'Error' }, {})).toBe(MapRobotStatus.Error);

        expect(getMapRobotStatus({ robotId: '', state: 'Follow' }, {})).toBe(MapRobotStatus.Offline);
    });
});
