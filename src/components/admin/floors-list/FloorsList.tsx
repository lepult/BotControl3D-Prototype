/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { useSelector } from 'react-redux';
// @ts-ignore
import { Accordion } from 'chayns-components';
import FloorItem from './FloorItem';
import { selectMapIds } from '../../../redux-modules/map/selectors';
import { selectEditingMapId } from '../../../redux-modules/misc/selectors';

const FloorsList = () => {
    const mapIds = useSelector(selectMapIds);
    const editingMapId = useSelector(selectEditingMapId);

    return (
        <Accordion
            head="Stockwerke"
            data
            defaultOpened={!!editingMapId}
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
