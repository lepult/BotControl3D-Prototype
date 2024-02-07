import React, { FC, useMemo, useState } from 'react';
// @ts-ignore
import { Accordion, SmallWaitCursor, ContextMenu, Button } from 'chayns-components';
import { useSelector } from 'react-redux';
import { selectRobotById } from '../../../redux-modules/robot-status/selectors';
import DestinationList from '../floors-list/destination-list/DestinationList';
import Preview from '../shared/Preview';
import { PreviewType } from '../../../types/deckgl-map';

const CONTEXT_MENU_ITEMS = [{
    text: 'Name ändern',
    icon: 'fa fa-pencil',
    onClick: () => console.log('Name ändern'),
}, {
    text: 'Roboter-Typ ändern',
    icon: 'fa fa-pencil',
    onClick: () => console.log('Roboter-Typ ändern'),
}, {
    text: 'Neustart-Zeit ändern',
    icon: 'fa fa-power-off',
    onClick: () => console.log('Neustart-Zeit ändern'),
}, {
    text: 'Calling Code anpassen',
    icon: 'fa fa-qrcode',
    onClick: () => console.log('Calling Code anpassen'),
}, {
    text: 'Modus ändern',
    icon: 'fa fa-gear',
    onClick: () => console.log('Modus ändern'),
}, {
    text: 'Ausgabepunkt ändern',
    icon: 'fa fa-location-dot',
    onClick: () => console.log('Ausgabepunkt ändern'),
}, {
    text: 'Ladestation ändern',
    icon: 'fa fa-charging-station',
    onClick: () => console.log('Ladestation ändern'),
}, {
    text: 'Homebase ändern',
    icon: 'fa fa-house',
    onClick: () => console.log('Homebase ändern'),
}];

const RobotItem: FC<{
    robotId: string
}> = ({
    robotId,
}) => {
    const robot = useSelector(selectRobotById(robotId));
    const [showMapPreview, setShowMapPreview] = useState(false);
    const hasMap = useMemo(() => robot?.robotStatus?.currentMap?.id && robot?.puduRobotStatus?.robotPose,[robot]);

    const status = useMemo(() => [{
        name: 'Roboter-Id',
        value: robotId
    }, {
        name: 'Position',
        value: robot?.robotStatus?.currentMap?.showName || 'Unbekannt'
    }, {
        name: 'Neustart-Zeit',
        value: robot?.robotStatus?.rebootTime || 'Unbekannt'
    }, {
        name: 'Calling Code',
        value: robot?.robotStatus?.callingCode?.code || 'Unbekannt'
    }, {
        name: 'Modus',
        value: robot?.robotStatus?.driveMode || 'Unbekannt'
    }, {
        name: 'Ausgabepunkt',
        value: robot?.robotStatus?.diningOutlet?.name || 'Unbekannt'
    }, {
        name: 'Ladestation',
        value: robot?.robotStatus?.chargingStation?.name || 'Unbekannt'
    }, {
        name: 'Homebase',
        value: robot?.robotStatus?.homeBaseMap?.showName || 'Unbekannt'
    }], [robot, robotId]);

    return (
        <Accordion
            head={robot?.robotStatus?.robotName || <SmallWaitCursor show/>}
            dataGroup="robots"
            isWrapped
            right={<ContextMenu items={CONTEXT_MENU_ITEMS}/>}
        >
            {robot?.robotStatus ? (
                <div>
                    {hasMap && showMapPreview && (
                        <div className="accordion__content">
                            <Preview
                                robotId={robotId}
                                mapId={robot?.robotStatus?.currentMap?.id as number}
                                previewType={PreviewType.Robot}
                            />
                        </div>
                    )}
                    <div className="accordion__content">
                        {hasMap && !showMapPreview && (
                            <div style={{ textAlign: 'center' }}>
                                <Button
                                    onClick={() => setShowMapPreview(true)}
                                >
                                    Vorschau anzeigen
                                </Button>
                            </div>
                        )}
                        <h3>
                            Status
                        </h3>
                        {status.map(({ name, value }) => (
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <p>{name}</p>
                                <p>{value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <SmallWaitCursor show/>
            )}
        </Accordion>
    )
};

export default RobotItem;
