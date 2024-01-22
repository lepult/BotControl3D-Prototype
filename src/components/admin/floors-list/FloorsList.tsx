/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
// @ts-ignore
import { Accordion } from 'chayns-components';
import FloorItem from './FloorItem';

const FLOORS = [{
    name: 'Tobit EG',
}, {
    name: 'T1 1.OG',
}, {
    name: 'T1 2.OG',
}, {
    name: 'T2 1.OG',
}, {
    name: 'T2 2.OG',
}]

const FloorsList = () => {
    return (
        <Accordion head="Stockwerke">
            {FLOORS.map((floor) => (
                <FloorItem name={floor.name}/>
            ))}
        </Accordion>
    );
};

export default FloorsList;
