import { TMap } from './map';
import { TDestination } from './destination';
import { TRoute } from './route';
import { RobotWorkingMode } from '../../constants/enums/robotWorkingMode';
import { RobotType } from '../../constants/enums/robotType';
import { DriveMode } from '../../constants/enums/driveMode';
import { RobotActivity } from '../../constants/enums/robotActivity';

export type TRobotStatus = {
    robotId: string;
    robotName?: string;
    robotType?: RobotType;
    state?: TCustomState | TMovementStatus | TGoState;
    currentMap?: TMap;
    homeBaseMap?: TMap;
    destination?: TDestination;
    currentDestination?: TDestination;
    diningOutlet?: TDestination;
    chargingStation?: TDestination;
    currentRoute?: TRoute;
    currentActivity?: TRobotActivity;
    appErrorStatus?: TAppErrorStatus;
    driveMode?: DriveMode;
    lowBatteryThreshold?: number;
    workingMode?: RobotWorkingMode;
    robotSpeed?: number;
    callingCode?: {
        id: 0;
        code: string;
        creationTime: Date;
        deletionTime: Date;
    };
    rebootTime?: number;
    reservedProgressTime?: Date;
    stateTime?: Date;
    driveModeTime?: Date;
    lastReboot?: Date;
    creationTime?: Date;
    deletionTime?: Date;
};

// region state
export type TCustomState = 'ArrivedAtDiningOutlet'
    | 'ArrivedAtPickupDestination'
    | 'OpeningDoor'
    | 'ClosingDoor'
    | 'WaitForElevator'
    | 'MovingWithElevator'
    | 'SendToChargingPile'
    | 'PrepareDriveToDestination';

export type TMovementStatus =
    'Idle'
    | 'Moving'
    // stuck by obstacle
    | 'Stuck'
    // close to the target point
    | 'Approaching'
    | 'Arrive'
    | 'Pause'
    | 'KeepAside'
    | 'Avoid'
    | 'Follow'
    | 'WaitAside'
    | 'MoveBack'
    | 'Error';

export type TGoState = 'Arriving' | 'Arrived' | 'Cancel';
// endregion

export type TRobotActivity = RobotActivity | string;

export type TAppErrorStatus =
    'EmergencySwitchPressed'
    | 'SelfRechargeFailed'
    | 'LostLidar'
    | 'LostLocalization'
    | 'LaserLocateLose'
    | 'PoseNotInit'
    | 'LostCAN'
    | 'LostEncoder'
    | 'LostIMU'
    | 'LostBattery'
    | 'LostCamera'
    | 'LostRGBD'
    | 'WheelErrorLeft'
    | 'WheelErrorRight'
    | 'InternalError'
    | 'CanNotReach'
    | 'CoreNotReady'
    | 'UnknownError'
    | 'NoDefine'
    | 'BusinessDefine'
    | 'Selbstreparatur'
    | 'NOTAUSSCHALTER'
    | 'Wird abgeschickt'
    | 'Angehalten'
    | string;

export enum RobotStatusLowerCase {
    ArrivedAtDiningOutlet = 'arrivedatdiningoutlet',
    ArrivedAtPickupDestination = 'arrivedatpickupdestination',
    OpeningDoor = 'openingdoor',
    ClosingDoor = 'closingdoor',
    WaitForElevator = 'waitforelevator',
    MovingWithElevator = 'movingwithelevator',
    SendToChargingPile = 'sendtochargingpile',
    PrepareDriveToDestination = 'preparedrivetodestination',
    Idle = 'idle',
    Moving = 'moving',
    Stuck = 'stuck',
    Approaching = 'approaching',
    Arrive = 'arrive',
    Pause = 'pause',
    KeepAside = 'keepaside',
    Avoid = 'avoid',
    Follow = 'follow',
    WaitAside = 'waitaside',
    MoveBack = 'moveback',
    Error = 'error',
    Arriving = 'arriving',
    Arrived = 'arrived',
    Cancel = 'cancel'
}
