import React, { FC } from 'react';
// @ts-ignore
import { Accordion, ContextMenu } from 'chayns-components';
import { useDispatch, useSelector } from 'react-redux';
import FloorPreview from './FloorPreview';
import { selectMapById } from '../../../redux-modules/map/selectors';
import { selectDestinationIdsByMapId } from '../../../redux-modules/destination/selectors';
import { changeAdminModeType } from '../../../redux-modules/misc/actions';
import { AdminModeType } from '../../../types/misc';
import { selectEditingMapId } from '../../../redux-modules/misc/selectors';
import FloorLocations from './FloorLocations';

const FloorItem: FC<{
    mapId: number
}> = ({
    mapId
}) => {
    const dispatch = useDispatch();

    const map = useSelector(selectMapById(mapId));
    const destinations = useSelector(selectDestinationIdsByMapId(mapId));
    const editingMapId = useSelector(selectEditingMapId);

    if (map.hidden === 1) {
        return null;
    }

    return (
        <Accordion
            head={map.showName}
            isWrapped
            dataGroup="floors"
            defaultOpened={editingMapId === mapId}
            right={(
                <ContextMenu
                    items={[{
                        text: 'Karte bearbeiten',
                        icon: 'fa fa-pencil',
                        onClick: () => dispatch(changeAdminModeType({
                            adminModeType: AdminModeType.editMap,
                            editingMapId: mapId,
                        })),
                    }]}
                />
            )}
        >
            <div className="accordion__content">
                <FloorPreview mapId={mapId}/>
            </div>
            <FloorLocations mapId={mapId}/>
        </Accordion>
    );
}

export default FloorItem;
