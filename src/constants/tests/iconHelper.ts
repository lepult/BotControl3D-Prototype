import { IIconData } from '../../utils/dataHelper';
import { CustomDestinationType, DestinationType } from '../../types/api/destination';
import { MapElementType } from '../../types/pudu-api/robotMap';

export const testChargingSvg = `
<svg
    viewBox="-15 -15 478 542"
    xmlns="http://www.w3.org/2000/svg"
    height="400"
    width="400"
>
    <path
        d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z"
        fill="rgba(25, 139, 44, 1)"
        stroke="rgba(255, 255, 255, 1)"
        stroke-width="30"
    />
</svg>`;

export const testIdleSvg = `
<svg
    viewBox="-15 -15 542 542"
    xmlns="http://www.w3.org/2000/svg"
    height="400"
    width="400"
>
    <path
        d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
        fill="rgba(25, 139, 44, 1)"
        stroke="rgba(255, 255, 255, 1)"
        stroke-width="30"
    />
</svg>`;

export const testIdleSelectedSvg = `
<svg
    viewBox="-15 -15 542 542"
    xmlns="http://www.w3.org/2000/svg"
    height="400"
    width="400"
>
    <path
        d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
        fill="rgba(0, 255, 42, 1)"
        stroke="rgba(255, 255, 255, 1)"
        stroke-width="30"
    />
</svg>`;

export const testTargetIconData: IIconData = {
    id: 1041,
    type: DestinationType.table,
    customType: CustomDestinationType.target,
    mapElementType: MapElementType.source,
    mapElementMode: 'table',
    name: '114',
    position: [22.554, 38.262, -0.62413],
    selected: false,
    invalid: false,
    routeData: {
        isRouteDestination: false,
        isNextDestination: false,
        isPreviousDestination: false,
        isEarlierDestination: false,
        isFinalDestination: false
    }
};

export const testTargetIcon = `
<svg
    viewBox="-15 -15 414 542"
    xmlns="http://www.w3.org/2000/svg"
    height="400"
    width="400"
>
    <path
        d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z"
        fill="rgba(84, 134, 157, 1)"
        stroke="rgba(255, 255, 255, 1)"
        stroke-width="30"
    />
</svg>`;

export const testDiningOutletIconData: IIconData = {
    id: 277,
    type: DestinationType.diningOutlet,
    customType: CustomDestinationType.diningOutlet,
    mapElementType: MapElementType.source,
    mapElementMode: 'dining_outlet',
    name: 'Theke2',
    position: [
        0.64914,
        5.7096,
        1.0201
    ],
    selected: false,
    invalid: true,
    routeData: {
        isRouteDestination: false,
        isNextDestination: false,
        isPreviousDestination: false,
        isEarlierDestination: false,
        isFinalDestination: false
    }
};

export const testDiningOutletIcon = `
<svg
    viewBox="-15 -15 670 542"
    xmlns="http://www.w3.org/2000/svg"
    height="400"
    width="400"
>
    <path
        d="M256 48c0-26.5 21.5-48 48-48H592c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H381.3c1.8-5 2.7-10.4 2.7-16V253.3c18.6-6.6 32-24.4 32-45.3V176c0-26.5-21.5-48-48-48H256V48zM571.3 347.3c6.2-6.2 6.2-16.4 0-22.6l-64-64c-6.2-6.2-16.4-6.2-22.6 0l-64 64c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L480 310.6V432c0 8.8 7.2 16 16 16s16-7.2 16-16V310.6l36.7 36.7c6.2 6.2 16.4 6.2 22.6 0zM0 176c0-8.8 7.2-16 16-16H368c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H16c-8.8 0-16-7.2-16-16V176zm352 80V480c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V256H352zM144 320c-8.8 0-16 7.2-16 16s7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H144z"
        fill="rgba(84, 134, 157, 0.5)"
        stroke="rgba(255, 255, 255, 0.5)"
        stroke-width="30"
    />
</svg>`;
