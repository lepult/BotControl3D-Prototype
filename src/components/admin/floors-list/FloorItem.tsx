import React, { FC, useState } from 'react';
// @ts-ignore
import { Accordion, ContextMenu, Button } from 'chayns-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectMapById } from '../../../redux-modules/map/selectors';
import { changeAdminModeType } from '../../../redux-modules/misc/actions';
import { AdminModeType } from '../../../types/misc';
import { selectEditingMapId } from '../../../redux-modules/misc/selectors';
import DestinationList from './destination-list/DestinationList';
import Preview from '../shared/Preview';
import { PreviewType } from '../../../types/deckgl-map';

const FloorItem: FC<{
    mapId: number
}> = ({
    mapId
}) => {
    const dispatch = useDispatch();

    const [showMapPreview, setShowMapPreview] = useState(false);

    const map = useSelector(selectMapById(mapId));
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
                {!showMapPreview && (
                    <div style={{ textAlign: 'center' }}>
                        <Button
                            onClick={() => setShowMapPreview(true)}
                        >
                            Vorschau anzeigen
                        </Button>
                    </div>
                )}
            </div>
            {showMapPreview && (
                <div className="accordion__content">
                    <Preview
                        mapId={mapId}
                        previewType={PreviewType.Floor}
                    />
                </div>
            )}
            <DestinationList mapId={mapId}/>
        </Accordion>
    );
}

export default FloorItem;
