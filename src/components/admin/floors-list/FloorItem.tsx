import React, { FC } from 'react';
// @ts-ignore
import { Accordion } from 'chayns-components';
import FloorPreview from './FloorPreview';
import pathData from '../../../constants/pathData';
import LocationList from './LocationList';

const LOCATIONS = [{
    name: 'Tisch 1',
    id: 0
}, {
    name: 'Tisch 2',
    id: 1
}, {
    name: 'Tisch 3',
    id: 2
}]

const FloorItem: FC<{
    name: string
}> = ({
    name
}) => {
    return (
        <Accordion head={name} isWrapped>
            <div className="accordion__content">
                <FloorPreview
                    floorModels={[{
                        id: 'scenegraphLayer-1',
                        url: 'https://w-lpinkernell-z.tobit.ag/models/Gross.glb',
                        position: [23.65, 12.2, 0],
                        orientation: [0, -5, 90]
                    }, {
                        id: 'scenegraphLayer-2',
                        url: 'https://w-lpinkernell-z.tobit.ag/models/Gltf-Test.glb',
                        position: [0.6, 1.3, 0],
                        orientation: [0, 122, 90]
                    }]}
                    map={pathData}
                />
            </div>
            <LocationList locations={LOCATIONS} name="Lieferpunkte"/>
            <LocationList locations={LOCATIONS} name="Ladestationen"/>
            <LocationList locations={LOCATIONS} name="Türen"/>
            <LocationList locations={LOCATIONS} name="Fahrstühle"/>
        </Accordion>
    );
}

export default FloorItem;
