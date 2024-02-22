import React, { FC, useState } from 'react';
// @ts-ignore
import { Accordion, ContextMenu, Button } from 'chayns-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectMapById, selectSelectedMap } from '../../../redux-modules/map/selectors';
import { setIsEditingMap } from '../../../redux-modules/misc/actions';
import DestinationList from './destination-list/DestinationList';
import Preview from '../shared/Preview';
import { PreviewType } from '../../../types/deckgl-map';
import { changeSelectedMap } from '../../../redux-modules/map/actions';

// TODO Write Tests for this component => Test that all information is rendered; Test that preview activation works

const FloorItem: FC<{
    mapId: number
}> = ({
    mapId
}) => {
    const dispatch = useDispatch();
    const selectedMapId = useSelector(selectSelectedMap);

    const [showMapPreview, setShowMapPreview] = useState(false);

    const map = useSelector(selectMapById(mapId));

    if (map.hidden === 1) {
        return null;
    }

    return (
        <Accordion
            head={map.showName}
            defaultOpened={mapId === selectedMapId}
            isWrapped
            dataGroup="floors"
            right={(
                <ContextMenu
                    items={[{
                        text: 'Karte bearbeiten',
                        icon: 'fa fa-pencil',
                        onClick: () => {
                            dispatch(changeSelectedMap({ mapId }));
                            dispatch(setIsEditingMap(true))
                        },
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
