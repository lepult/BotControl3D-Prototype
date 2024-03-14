import { TMappedDestination } from '../../utils/dataHelper';
import { CustomDestinationType, DestinationType, TDestination } from '../../types/api/destination';
import { TRoute } from '../../types/api/route';

export const testMappedDestinations: TMappedDestination[] = [
    {
        destination: {
            id: 948,
            mapId: 88,
            name: '10',
            type: DestinationType.table,
            customType: CustomDestinationType.target,
            creationTime: new Date('2024-01-05T15:05:28.143958Z'),
        },
        mapElement: {
            type: 'source',
            vector: [33.91, 10.133, 0.041992],
            name: '10',
            mode: 'table',
            id: '10',
            group: 'Standardgruppierung',
            dir: 0.041992,
            dirMode: 2,
            doubleDir: 0
        }
    },
    {
        destination: {
            id: 949,
            mapId: 88,
            name: '11',
            type: DestinationType.table,
            customType: CustomDestinationType.target,
            creationTime: new Date('2024-01-05T15:05:28.143958Z'),
        },
        mapElement: {
            type: 'source',
            vector: [23.882, 12.668, 2.3259],
            name: '11',
            mode: 'table',
            id: '11',
            group: 'Standardgruppierung',
            dir: 2.3259,
            dirMode: 2,
            doubleDir: 0
        }
    },
    {
        destination: {
            id: 950,
            mapId: 88,
            name: '12',
            type: DestinationType.table,
            customType: CustomDestinationType.target,
            creationTime: new Date('2024-01-05T15:05:28.143958Z'),
        },
        mapElement: {
            type: 'source',
            vector: [24.789, 10.691, 1.5663],
            name: '12',
            mode: 'table',
            id: '12',
            group: 'Standardgruppierung',
            dir: 1.5663,
            dirMode: 2,
            doubleDir: 0
        }
    },
    {
        destination: {
            id: 951,
            mapId: 88,
            name: '13',
            type: DestinationType.table,
            customType: CustomDestinationType.target,
            creationTime: new Date('2024-01-05T15:05:28.143958Z'),
        },
        mapElement: {
            type: 'source',
            vector: [23.651, 10.563, 1.5239],
            name: '13',
            mode: 'table',
            id: '13',
            group: 'Standardgruppierung',
            dir: 1.5239,
            dirMode: 2,
            doubleDir: 0
        }
    },
    {
        destination: {
            id: 952,
            mapId: 88,
            name: '14',
            type: DestinationType.table,
            customType: CustomDestinationType.target,
            creationTime: new Date('2024-01-05T15:05:28.143958Z'),
        },
        mapElement: {
            type: 'source',
            vector: [20.869, 10.738, 1.5639],
            name: '14',
            mode: 'table',
            id: '14',
            group: 'Standardgruppierung',
            dir: 1.5639,
            dirMode: 2,
            doubleDir: 0
        }
    }
];

export const testCurrentRoute: TRoute = {
    id: 2368,
    personId: '135-76284',
    robotId: '2050e702a434',
    routeDestinations: [
        {
            id: 3982,
            routeId: 2368,
            destination: {
                id: 948,
                mapId: 88,
                name: '10',
                type: DestinationType.table,
                customType: CustomDestinationType.target,
                creationTime: new Date('2024-01-05T15:05:28.143958Z'),
                intermediateDestinations: []
            },
            sequence: 1,
            startTime: new Date('2024-03-12T11:15:19.237589Z'),
        },
        {
            id: 3983,
            routeId: 2368,
            destination: {
                id: 949,
                mapId: 88,
                name: '11',
                type: DestinationType.table,
                customType: CustomDestinationType.target,
                creationTime: new Date('2024-01-05T15:05:28.143958Z'),
                intermediateDestinations: []
            },
            sequence: 2
        },
        {
            id: 3984,
            routeId: 2368,
            destination: {
                id: 950,
                mapId: 88,
                name: '12',
                type: DestinationType.table,
                customType: CustomDestinationType.target,
                creationTime: new Date('2024-01-05T15:05:28.143958Z'),
                intermediateDestinations: []
            },
            sequence: 3
        }
    ]
}

export const testCurrentDestination: TDestination = {
    id: 949,
    mapId: 88,
    name: '11',
    type: DestinationType.table,
    customType: CustomDestinationType.target,
    creationTime: new Date('2024-01-05T15:05:28.143958Z'),
    intermediateDestinations: []
}

export const testPreviousDestination = {
    id: 948,
    mapId: 88,
    name: '10',
    type: DestinationType.table,
    customType: CustomDestinationType.target,
    creationTime: new Date('2024-01-05T15:05:28.143958Z'),
    intermediateDestinations: []
}

export const testResult = [
    {
        id: 948,
        type: 'table',
        customType: 'target-destination',
        mapElementType: 'source',
        mapElementMode: 'table',
        name: '10',
        position: [33.91, 10.133, 0.041992],
        selected: false,
        invalid: false,
        routeData: {
            isRouteDestination: true,
            isNextDestination: false,
            isPreviousDestination: true,
            isEarlierDestination: true,
            isFinalDestination: false
        }
    },
    {
        id: 949,
        type: 'table',
        customType: 'target-destination',
        mapElementType: 'source',
        mapElementMode: 'table',
        name: '11',
        position: [23.882, 12.668, 2.3259],
        selected: false,
        invalid: false,
        routeData: {
            isRouteDestination: true,
            isNextDestination: true,
            isPreviousDestination: false,
            isEarlierDestination: false,
            isFinalDestination: false
        }
    },
    {
        id: 950,
        type: 'table',
        customType: 'target-destination',
        mapElementType: 'source',
        mapElementMode: 'table',
        name: '12',
        position: [24.789, 10.691, 1.5663],
        selected: false,
        invalid: false,
        routeData: {
            isRouteDestination: true,
            isNextDestination: false,
            isPreviousDestination: false,
            isEarlierDestination: false,
            isFinalDestination: true
        }
    },
    {
        id: 951,
        type: 'table',
        customType: 'target-destination',
        mapElementType: 'source',
        mapElementMode: 'table',
        name: '13',
        position: [23.651, 10.563, 1.5239],
        selected: false,
        invalid: false,
        routeData: {
            isRouteDestination: false,
            isNextDestination: false,
            isPreviousDestination: false,
            isEarlierDestination: false,
            isFinalDestination: false
        }
    },
    {
        id: 952,
        type: 'table',
        customType: 'target-destination',
        mapElementType: 'source',
        mapElementMode: 'table',
        name: '14',
        position: [20.869, 10.738, 1.5639],
        selected: false,
        invalid: false,
        routeData: {
            isRouteDestination: false,
            isNextDestination: false,
            isPreviousDestination: false,
            isEarlierDestination: false,
            isFinalDestination: false
        }
    }
];