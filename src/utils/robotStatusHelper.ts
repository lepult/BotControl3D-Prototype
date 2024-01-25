import { RobotStatusLowerCase, TRobotStatus } from '../types/api/robotStatus';
import { TPuduApiRobotStatus } from '../types/pudu-api/robotStatus';
import {
    ROBOT_CHARGE_FULL_REGEX,
    ROBOT_CHARGING_REGEX,
    ROBOT_ERROR_REGEX,
    ROBOT_STOP_CHARGE_REGEX
} from '../constants/regex';
import { RobotActivity } from '../constants/enums/robotActivity';

enum MapRobotStatus {
    'Offline' = 'Offline',
    'Idle' = 'Idle',
    'Charged' = 'Charged',
    'Charging' = 'Charging',
    'ChargingError' = 'ChargingError',
    'ArrivedAtDiningOutlet' = 'ArrivedAtDiningOutlet',
    'SendToChargingPile' = 'SendToChargingPile',
    'WaitForDoor' = 'WaitForDoor',
    'WaitForElevator' = 'WaitForElevator',
    'MovingWithElevator' = 'MovingWithElevator',
    'ArrivedAtPickupDestination' = 'ArrivedAtPickupDestination',
    'PrepareDriveToDestination' = 'PrepareDriveToDestination',
    'SendToDestination' = 'SendToDestination',
    'ArrivedAtDestination' = 'ArrivedAtDestination',
    'Avoid' = 'Avoid',
    'Blocked' = 'Blocked',
    'Cancel' = 'Cancel',
    'Error' = 'Error',
}

export const getMapRobotStatus = (robotStatus: TRobotStatus | undefined, puduApiRobotStatus: TPuduApiRobotStatus | undefined): MapRobotStatus => {
    let mapRobotStatus: MapRobotStatus | undefined;
    if (!puduApiRobotStatus) {
        return MapRobotStatus.Offline;
    }

    if (robotStatus?.state) {
        mapRobotStatus = getChaynsMapRobotStatus(robotStatus);

        // If robotStatus is Idle, but puduStatus is not, use puduStatus
        if (mapRobotStatus === MapRobotStatus.Idle && puduApiRobotStatus.robotState?.toLowerCase() === 'busy') {
            mapRobotStatus = getPuduMapRobotStatus(puduApiRobotStatus);
            if (!mapRobotStatus) {
                return MapRobotStatus.Idle;
            }
        }

        if (mapRobotStatus) {
            return mapRobotStatus;
        }
    }

    mapRobotStatus = getPuduMapRobotStatus(puduApiRobotStatus);
    if (mapRobotStatus) {
        return mapRobotStatus;
    }

    return MapRobotStatus.Offline;
};

const getChaynsMapRobotStatus = (robotStatus: TRobotStatus): MapRobotStatus | undefined => {
    const state = robotStatus?.state?.toLowerCase();

    if (!state) {
        return undefined;
    }

    if (state.match(ROBOT_CHARGE_FULL_REGEX)) {
        return MapRobotStatus.Charged;
    }

    if (state.match(ROBOT_CHARGING_REGEX)) {
        return MapRobotStatus.Charging;
    }

    if (state.match(ROBOT_STOP_CHARGE_REGEX)) {
        return MapRobotStatus.Idle;
    }

    if (state !== RobotStatusLowerCase.Error && state.match(ROBOT_ERROR_REGEX)) {
        return MapRobotStatus.ChargingError;
    }

    switch (state) {
        case RobotStatusLowerCase.ArrivedAtDiningOutlet:
            return MapRobotStatus.ArrivedAtDiningOutlet;
        case RobotStatusLowerCase.SendToChargingPile:
            return MapRobotStatus.SendToChargingPile;
        case RobotStatusLowerCase.OpeningDoor:
        case RobotStatusLowerCase.ClosingDoor:
            return MapRobotStatus.WaitForDoor;
        case RobotStatusLowerCase.WaitForElevator:
            return MapRobotStatus.WaitForElevator;
        case RobotStatusLowerCase.MovingWithElevator:
            return MapRobotStatus.MovingWithElevator;
        case RobotStatusLowerCase.ArrivedAtPickupDestination:
            return MapRobotStatus.ArrivedAtPickupDestination;
        case RobotStatusLowerCase.PrepareDriveToDestination:
            return MapRobotStatus.PrepareDriveToDestination;
        case RobotStatusLowerCase.Idle:
            return MapRobotStatus.Idle;
        case RobotStatusLowerCase.Moving:
        case RobotStatusLowerCase.Approaching:
        case RobotStatusLowerCase.Arriving: {
            if (robotStatus?.currentActivity === RobotActivity.SendToCharge) {
                return MapRobotStatus.SendToChargingPile;
            }
            return MapRobotStatus.SendToDestination;
        }
        case RobotStatusLowerCase.Arrive:
        case RobotStatusLowerCase.Arrived: {
            if (robotStatus?.currentActivity === RobotActivity.SendToCharge) {
                return MapRobotStatus.SendToChargingPile;
            }
            return MapRobotStatus.ArrivedAtDestination;

        }
        case RobotStatusLowerCase.Avoid:
            return MapRobotStatus.Avoid;
        case RobotStatusLowerCase.Stuck:
        case RobotStatusLowerCase.KeepAside:
        case RobotStatusLowerCase.WaitAside:
        case RobotStatusLowerCase.MoveBack:
            return MapRobotStatus.Blocked;
        case RobotStatusLowerCase.Cancel:
            return MapRobotStatus.Cancel;
        case RobotStatusLowerCase.Error:
            return MapRobotStatus.Error;
        default:
            return undefined;
    }

};

const getPuduMapRobotStatus = (puduApiRobotStatus: TPuduApiRobotStatus): MapRobotStatus | undefined => {
    let mapRobotStatus: MapRobotStatus | undefined;

    if (!puduApiRobotStatus) {
        return mapRobotStatus;
    }

    if (puduApiRobotStatus?.chargeStage?.toLowerCase() !== RobotStatusLowerCase.Idle) {
        if (puduApiRobotStatus.chargeStage?.match(ROBOT_CHARGE_FULL_REGEX)) {
            mapRobotStatus = MapRobotStatus.Charged;
        }

        if (puduApiRobotStatus.chargeStage?.match(ROBOT_STOP_CHARGE_REGEX)) {
            mapRobotStatus = MapRobotStatus.Idle;
        }

        if (puduApiRobotStatus.chargeStage?.match(ROBOT_CHARGING_REGEX)) {
            mapRobotStatus = MapRobotStatus.Charging;
        }

        if (puduApiRobotStatus.chargeStage?.match(ROBOT_ERROR_REGEX)) {
            mapRobotStatus = MapRobotStatus.ChargingError;
        }
    } else if (puduApiRobotStatus.moveState?.toLowerCase() === 'error') {
        mapRobotStatus = MapRobotStatus.Error;
    }

    return mapRobotStatus;
};
