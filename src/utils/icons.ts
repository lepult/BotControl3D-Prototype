import { icon, library } from '@fortawesome/fontawesome-svg-core';
import {
    faBatteryFull,
    faBolt,
    faBoxesPacking,
    faChargingStation,
    faCircleCheck,
    faCircleDot,
    faCirclePause,
    faCircleStop,
    faDoorClosed,
    faDoorOpen,
    faElevator,
    faFlagCheckered,
    faHourglass,
    faLocationDot,
    faLocationPin,
    faPowerOff,
    faSpinner,
    faSquareParking,
    faTrafficLight,
    faTriangleExclamation,
    faTruckFast,
    faUpDown
} from '@fortawesome/free-solid-svg-icons';
import { Color } from '@deck.gl/core/typed';
import { MapRobotStatus } from '../types/deckgl-map';
import { CustomDestinationType, DestinationType } from '../types/api/destination';
import { IIconData } from './dataHelper';
import { MapElementType } from '../types/pudu-api/robotMap';

const STROKE_WIDTH = 30;
const MIN_X_Y = -STROKE_WIDTH / 2;

type TFaIcon = {
    icon: [number, number, any, any, string],
}

const getSvg = (faIcon: TFaIcon, red: number, green: number, blue: number, alpha: number) => `
<svg
    viewBox="${MIN_X_Y} ${MIN_X_Y} ${faIcon.icon[0] + STROKE_WIDTH} ${faIcon.icon[1] + STROKE_WIDTH}"
    xmlns="http://www.w3.org/2000/svg"
    height="400"
    width="400"
>
    <path
        d="${faIcon.icon[4]}"
        fill="rgba(${red}, ${green}, ${blue}, ${alpha})"
        stroke="rgba(255, 255, 255, ${alpha})"
        stroke-width="30"
    />
</svg>`;

[
    faHourglass,
    faBatteryFull,
    faPowerOff,
    faChargingStation,
    faTriangleExclamation,
    faCircleCheck,
    faDoorOpen,
    faElevator,
    faSpinner,
    faTruckFast,
    faCircleStop,
    faCirclePause,
    faTrafficLight,
    faLocationPin,
    faLocationDot,
    faBoxesPacking,
    faCircleDot,
    faDoorClosed,
    faUpDown,
    faBolt,
    faSquareParking,
    faFlagCheckered,
].forEach((i) => library.add(i));

const hourglass = icon({ prefix: 'fas', iconName: 'hourglass' });
const charged = icon({ prefix: 'fas', iconName: 'battery-full' });
const off = icon({ prefix: 'fas', iconName: 'power-off' });
const chargingStation = icon({ prefix: 'fas', iconName: 'charging-station' });
const exclamation = icon({ prefix: 'fas', iconName: 'triangle-exclamation' });
const check = icon({ prefix: 'fas', iconName: 'circle-check' });
const doorOpen = icon({ prefix: 'fas', iconName: 'door-open' });
const elevator = icon({ prefix: 'fas', iconName: 'elevator' });
const spinner = icon({ prefix: 'fas', iconName: 'spinner' });
const truck = icon({ prefix: 'fas', iconName: 'truck-fast' });
const stop = icon({ prefix: 'fas', iconName: 'circle-stop' });
const pause = icon({ prefix: 'fas', iconName: 'circle-pause' });
const trafficLight = icon({ prefix: 'fas', iconName: 'traffic-light' });
const locationPin = icon({ prefix: 'fas', iconName: 'location-pin' });
const locationDot = icon({ prefix: 'fas', iconName: 'location-dot' });
const boxesPacking = icon({ prefix: 'fas', iconName: 'boxes-packing' });
const circleDot = icon({ prefix: 'fas', iconName: 'circle-dot' });
const doorClosed = icon({ prefix: 'fas', iconName: 'door-closed' });
const upDown = icon({ prefix: 'fas', iconName: 'up-down' });
const bolt = icon({ prefix: 'fas', iconName: 'bolt' });
const parking = icon({ prefix: 'fas', iconName: 'square-parking' });
const flagCheckered = icon({ prefix: 'fas', iconName: 'flag-checkered' });

export const getIconByMapRobotStatus = (mapRobotStatus: MapRobotStatus, red: number, green: number, blue: number): string => {
    let i = null;
    switch (mapRobotStatus) {
        case MapRobotStatus.Offline:
            i = off;
            break;
        case MapRobotStatus.Idle:
            i = check;
            break;
        case MapRobotStatus.Charged:
            i = charged;
            break;
        case MapRobotStatus.SendToChargingPile:
        case MapRobotStatus.Charging:
            i = bolt;
            break;
        case MapRobotStatus.ArrivedAtDestination:
        case MapRobotStatus.ArrivedAtDiningOutlet:
        case MapRobotStatus.ArrivedAtPickupDestination:
            i = flagCheckered;
            break;
        case MapRobotStatus.WaitForDoor:
            i = doorOpen;
            break;
        case MapRobotStatus.WaitForElevator:
        case MapRobotStatus.MovingWithElevator:
            i = upDown;
            break;
        case MapRobotStatus.PrepareDriveToDestination:
            i = hourglass;
            break;
        case MapRobotStatus.SendToDestination:
            i = truck;
            break;
        case MapRobotStatus.Avoid:
        case MapRobotStatus.Blocked:
            i = trafficLight;
            break;
        case MapRobotStatus.Cancel:
            i = stop;
            break;
        case MapRobotStatus.Pause:
            i = pause;
            break;
        case MapRobotStatus.ChargingError:
        case MapRobotStatus.Error:
        default:
            i = exclamation;
            break;
    }
    return getSvg(i as TFaIcon, red, green, blue, 1);

}

export const getIconByDestinationType = (iconData: IIconData, invalid: boolean): string => {
    let i = null;
    switch (iconData.customType) {
        case CustomDestinationType.target:
            i = iconData.routeData.isRouteDestination
                ? locationDot
                : locationPin;
            break;
        case CustomDestinationType.diningOutlet:
            i = boxesPacking;
            break;
        case CustomDestinationType.chargingStation:
            i = chargingStation;
            break;
        case CustomDestinationType.openDoor:
        case CustomDestinationType.closeDoor:
        case CustomDestinationType.inFrontOfElevator:
        case CustomDestinationType.behindElevator:
        case CustomDestinationType.intermediate:
            i = doorClosed;
            break;
        case CustomDestinationType.elevator:
            i = elevator;
            break;
        default:
            break;
    }
    if (!i) {
        const type = iconData.mapElementType === MapElementType.source ? iconData.mapElementMode : iconData.type;
        switch (type) {
            case DestinationType.table:
                i = iconData.routeData.isRouteDestination
                    ? locationDot
                    : locationPin;
                break;
            case DestinationType.diningOutlet:
                i = boxesPacking;
                break;
            case DestinationType.parking:
                i = parking;
                break;
            case DestinationType.chargingPile:
                i = chargingStation;
                break;
            case DestinationType.transit:
            case DestinationType.dishwashing:
            default:
                i = circleDot;
                break;
        }
    }

    const colors = getIconColor(iconData, invalid);

    return getSvg(i as TFaIcon, colors[0], colors[1], colors[2], colors[3] || 1);
};

const getIconColor = (iconData: IIconData, invalid: boolean): Color => {
    if (iconData.routeData.isFinalDestination) {
        return [255, 183, 77];
    }
    if (iconData.routeData.isNextDestination) {
        return [159, 95, 0];
    }
    if (iconData.routeData.isRouteDestination && !iconData.routeData.isEarlierDestination) {
        return [255, 152, 0];
    }
    if (iconData.selected) {
        return [3, 169, 244];
    }
    return [84, 134, 157, invalid ? 0.5 : 1];
};
