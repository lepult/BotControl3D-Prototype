/* eslint-disable @typescript-eslint/ban-ts-comment */
import { sortMapsAndDestinations } from './sortHelper';
import { DestinationType } from '../types/api/destination';

describe('sortMapsAndDestinations', () => {
    test('should sort maps', () => {
        expect(sortMapsAndDestinations([{
            id: 2,
            name: 'b',
            showName: 'z'
        }, {
            id: 1,
            name: 'c'
        }, {
            id: 0,
            name: 'a',
        }])).toStrictEqual([{
            id: 0,
            name: 'a',
            destinations: undefined,
        }, {
            id: 1,
            name: 'c',
            destinations: undefined,
        }, {
            id: 2,
            name: 'b',
            showName: 'z',
            destinations: undefined,
        }]);
    });

    test('should sort destinations', () => {
        expect(sortMapsAndDestinations([{
            id: 0,
            name: 'a',
            destinations: [{
                id: 2,
                mapId: 1,
                name: 'c',
                type: DestinationType.table,
            }, {
                id: 1,
                mapId: 1,
                name: 'b',
                type: DestinationType.table,
            }, {
                id: 0,
                mapId: 1,
                name: 'a',
                type: DestinationType.table,
            }]
        }])).toStrictEqual([{
            id: 0,
            name: 'a',
            destinations: [{
                id: 0,
                mapId: 1,
                name: 'a',
                type: DestinationType.table,
            }, {
                id: 1,
                mapId: 1,
                name: 'b',
                type: DestinationType.table,
            }, {
                id: 2,
                mapId: 1,
                name: 'c',
                type: DestinationType.table,
            }],
        }]);
    })
});