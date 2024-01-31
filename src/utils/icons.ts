import { library, icon } from '@fortawesome/fontawesome-svg-core'
import {
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
} from '@fortawesome/free-solid-svg-icons'
import { MapRobotStatus } from '../types/deckgl-map';

const getSvg = (faIcon, red: number, green: number, blue: number) => {
    return `
    <svg
        viewBox="0 0 ${faIcon.icon[0]} ${faIcon.icon[1]}"
        xmlns="http://www.w3.org/2000/svg"
        height="400"
        width="400"
    >
        <path
            d="${faIcon.icon[4]}"
            fill="rgb(${red}, ${green}, ${blue})"
            stroke="rgb(255, 255, 255)"
            stroke-width="30"
        />
    </svg>`
}

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
    faTrafficLight
].forEach((i) => library.add(i));

const hourglass = icon({ prefix: 'fas', iconName: 'hourglass' });
const charged = icon({ prefix: 'fas', iconName: 'battery-full' });
const off = icon({ prefix: 'fas', iconName: 'power-off' });
const charge = icon({ prefix: 'fas', iconName: 'charging-station' });
const exclamation = icon({ prefix: 'fas', iconName: 'triangle-exclamation' });
const check = icon({ prefix: 'fas', iconName: 'circle-check' });
const door = icon({ prefix: 'fas', iconName: 'door-open' });
const elevator = icon({ prefix: 'fas', iconName: 'elevator' });
const spinner = icon({ prefix: 'fas', iconName: 'spinner' });
const truck = icon({ prefix: 'fas', iconName: 'truck-fast' });
const stop = icon({ prefix: 'fas', iconName: 'circle-stop' });
const pause = icon({ prefix: 'fas', iconName: 'circle-pause' });
const trafficLight = icon({ prefix: 'fas', iconName: 'traffic-light' });

export const getIconByMapRobotStatus = (mapRobotStatus: MapRobotStatus, red: number, green: number, blue: number): string => {
    let i = null;
    switch (mapRobotStatus) {
        case MapRobotStatus.Offline:
            i = off;
            break;
        case MapRobotStatus.Idle:
            i = hourglass;
            break;
        case MapRobotStatus.Charged:
            i = charged;
            break;
        case MapRobotStatus.SendToChargingPile:
        case MapRobotStatus.Charging:
            i = charge;
            break;
        case MapRobotStatus.ChargingError:
        case MapRobotStatus.Error:
            i = exclamation;
            break;
        case MapRobotStatus.ArrivedAtDestination:
        case MapRobotStatus.ArrivedAtDiningOutlet:
        case MapRobotStatus.ArrivedAtPickupDestination:
            i = check;
            break;
        case MapRobotStatus.WaitForDoor:
            i = door;
            break;
        case MapRobotStatus.WaitForElevator:
        case MapRobotStatus.MovingWithElevator:
            i = elevator;
            break;
        case MapRobotStatus.PrepareDriveToDestination:
            i = spinner;
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
        default:
            i = exclamation;
            break;
    }
    return getSvg(i, red, green, blue);

}