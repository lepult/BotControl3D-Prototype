/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { useSelector } from 'react-redux';
// @ts-ignore
import { Accordion } from 'chayns-components';
import FloorItem from './FloorItem';
import { selectMapIds } from '../../../redux-modules/map/selectors';

const FloorsList = () => {
    const mapIds = useSelector(selectMapIds);

    return (
        <Accordion
            head="Stockwerke"
            data
            defaultOpened
            dataGroup="top-level"
        >
            {mapIds.map((mapId) => (
                <FloorItem
                    key={mapId}
                    mapId={mapId}
                />
            ))}
        </Accordion>
    );
};

export default FloorsList;
