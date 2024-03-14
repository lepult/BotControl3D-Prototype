export const testDestinationsLayerDataStore = {
    misc: {
        selectedDestination: undefined,
    },
    destination: {
        entities: {
            226: {
                "destination": {
                    "id": 226,
                    "mapId": 27,
                    "name": "01",
                    "type": "table",
                    "customType": "target-destination",
                    "chaynsUser": null,
                    "preposition": "zu",
                    "chaynsCodesUrl": null,
                    "automationDevice": null,
                    "roomId": null,
                    "creationTime": "2023-09-07T10:55:29.666589Z"
                },
                "mapElement": {
                    "type": "source",
                    "vector": [
                        0.032623,
                        6.5547,
                        -1.3943
                    ],
                    "name": "01",
                    "mode": "table",
                    "id": "01",
                    "group": "Atrium",
                    "dir": -1.3943,
                    "dirMode": 2,
                    "doubleDir": 0
                }
            },
            227: {
                "destination": {
                    "id": 227,
                    "mapId": 27,
                    "name": "10",
                    "type": "table",
                    "customType": "target-destination",
                    "chaynsUser": null,
                    "preposition": "zu",
                    "chaynsCodesUrl": null,
                    "automationDevice": null,
                    "roomId": null,
                    "creationTime": "2023-09-07T10:55:29.682204Z"
                },
                "mapElement": {
                    "type": "source",
                    "vector": [
                        -3.7985,
                        7.4777,
                        1.0032
                    ],
                    "name": "10",
                    "mode": "table",
                    "id": "10",
                    "group": "Atrium",
                    "dir": 1.0032,
                    "dirMode": 2,
                    "doubleDir": 0
                }
            },
            274: {
                "destination": {
                    "id": 274,
                    "mapId": 27,
                    "name": "Fahrstuhl",
                    "type": "table",
                    "customType": "elevator",
                    "chaynsUser": null,
                    "preposition": "zum",
                    "chaynsCodesUrl": null,
                    "automationDevice": null,
                    "roomId": null,
                    "creationTime": "2023-09-07T10:55:30.307271Z"
                },
                "mapElement": {
                    "type": "source",
                    "vector": [
                        6.7785,
                        24.061,
                        -2.3321
                    ],
                    "name": "Fahrstuhl",
                    "mode": "table",
                    "id": "Fahrstuhl",
                    "dir": -2.3321,
                    "dirMode": 2,
                    "doubleDir": 0
                }
            },
        },
        fetchState: 2,
        ids: [226, 227, 274, 20, 113, 114],
        idsByMapId: {
            27: [226, 227, 274],
        },
    },
    map: {
        selectedRobot: '2050e70224d4',
        selectedMap: 27,
    },
    robotStatus: {
        entities: {
            '2050e70224d4': {
                robotStatus: {
                    currentRoute: null,
                    destination: null,
                    currentDestination: null,
                }
            }
        }
    }
};

export const testDestinationsLayerDataResult = [
    {
        id: 226,
        type: 'table',
        customType: 'target-destination',
        mapElementType: 'source',
        mapElementMode: 'table',
        name: '01',
        position: [
            0.032623,
            6.5547,
            -1.3943
        ],
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
        id: 227,
        type: 'table',
        customType: 'target-destination',
        mapElementType: 'source',
        mapElementMode: 'table',
        name: '10',
        position: [
            -3.7985,
            7.4777,
            1.0032
        ],
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
        id: 274,
        type: 'table',
        customType: 'elevator',
        mapElementType: 'source',
        mapElementMode: 'table',
        name: 'Fahrstuhl',
        position: [
            6.7785,
            24.061,
            -2.3321
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
    }
];
