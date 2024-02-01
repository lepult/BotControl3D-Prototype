import React, { FC, useMemo, useState } from 'react';
// @ts-ignore
import { Accordion, SmallWaitCursor, ContextMenu, Button } from 'chayns-components';
import { useSelector } from 'react-redux';
import { selectRobotStatusById } from '../../../../redux-modules/robot-status/selectors';
import FloorLocations from '../../floors-list/FloorLocations';
import UserModeMap from '../../../user/user-mode-map/UserModeMap';
import RobotItemMap from './RobotItemMap';

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
    const robotStatus = useSelector(selectRobotStatusById(robotId));
    const [showMapPreview, setShowMapPreview] = useState(false);

    const status = useMemo(() => [{
        name: 'Roboter-Id',
        value: robotId
    }, {
        name: 'Position',
        value: robotStatus?.currentMap?.showName || 'Unbekannt'
    }, {
        name: 'Neustart-Zeit',
        value: robotStatus?.rebootTime || 'Unbekannt'
    }, {
        name: 'Calling Code',
        value: robotStatus?.callingCode?.code || 'Unbekannt'
    }, {
        name: 'Modus',
        value: robotStatus?.driveMode || 'Unbekannt'
    }, {
        name: 'Ausgabepunkt',
        value: robotStatus?.diningOutlet?.name || 'Unbekannt'
    }, {
        name: 'Ladestation',
        value: robotStatus?.chargingStation?.name || 'Unbekannt'
    }, {
        name: 'Homebase',
        value: robotStatus?.homeBaseMap?.showName || 'Unbekannt'
    }], [robotStatus, robotId]);

    return (
        <Accordion
            head={robotStatus?.robotName || <SmallWaitCursor show/>}
            dataGroup="robots"
            isWrapped
            right={<ContextMenu items={CONTEXT_MENU_ITEMS}/>}
        >
            {robotStatus ? (
                <div>
                    {robotStatus.currentMap?.id && showMapPreview && (
                        <div className="accordion__content">
                            <RobotItemMap
                                robotId={robotId}
                                mapId={robotStatus.currentMap.id}
                            />
                        </div>
                    )}
                    {robotStatus.currentMap?.id && (
                        <div>
                            <Accordion
                                head="Standorte"
                                isWrapped
                                dataGroup="robot-item"
                            >
                                <FloorLocations mapId={robotStatus.currentMap.id}/>
                            </Accordion>
                        </div>
                    )}
                    <Accordion
                        head="Status"
                        isWrapped
                        dataGroup="robot-item"
                    >
                        <div className="accordion__content">
                            {status.map(({ name, value }) => (
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <p>{name}</p>
                                    <p>{value}</p>
                                </div>
                            ))}
                        </div>
                    </Accordion>
                    {robotStatus.currentMap?.id && (
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
                    )}
                </div>
            ) : (
                <SmallWaitCursor show/>
            )}
        </Accordion>
    )
};

export default RobotItem;
