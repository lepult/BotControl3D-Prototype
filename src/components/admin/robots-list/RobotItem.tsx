import React, { FC, useMemo, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Accordion, SmallWaitCursor, ContextMenu, Button, Tooltip } from 'chayns-components';
import { useSelector } from 'react-redux';
import { selectRobotById } from '../../../redux-modules/robot-status/selectors';
import Preview from '../shared/Preview';
import { PreviewType } from '../../../types/deckgl-map';
import { getMapRobotStatus } from '../../../utils/robotStatusHelper';

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
        name: 'Status',
        value: getMapRobotStatus(robot?.robotStatus, robot?.puduRobotStatus) || 'Offline'
    }, {
        name: 'aktuelles Stockwerk',
        value: robot?.robotStatus?.currentMap?.showName || 'Unbekannt',
        tooltipText: 'Das Stockwerk in dem sich der Roboter aktuell befindet.',
    }, {
        name: 'Neustart-Zeit',
        value: robot?.robotStatus?.rebootTime
            ? `${new Date(robot.robotStatus.rebootTime * 1000).toISOString().slice(11, 16)} Uhr`
            : 'Unbekannt',
        tooltipText: 'Zu dieser Uhrzeit wird der Roboter täglich neugestartet.',
    }, {
        name: 'Calling Code',
        value: robot?.robotStatus?.callingCode?.code || 'Unbekannt',
        tooltipText: 'Der eingestellte Calling Code wird auf dem Display des Roboters angezeigt.',
    }, {
        name: 'Fahrt-Modus',
        value: robot?.robotStatus?.driveMode || 'Unbekannt',
        tooltipText: 'Der eingestellte Fahrt-Modus bestimmt wie sich der Roboter verhält.',
    }, {
        name: 'Ausgabepunkt',
        value: robot?.robotStatus?.diningOutlet?.name || 'Unbekannt',
        tooltipText: 'Zu diesem Standort fährt der Roboter im DiningOutlet Fahrt-Modus, um Gegenstände abzuholen.',
    }, {
        name: 'Ladestation',
        value: robot?.robotStatus?.chargingStation?.name || 'Unbekannt',
        tooltipText: 'Diese Ladestation nutzt der Roboter beim Aufladen.',
    }, {
        name: 'Homebase',
        value: robot?.robotStatus?.homeBaseMap?.showName || 'Unbekannt',
        tooltipText: 'Das Stockwerk von dem der Roboter aus arbeitet.',
    }], [robot, robotId]);

    return (
        <Accordion
            head={robot?.robotStatus?.robotName || <SmallWaitCursor show/>}
            dataGroup="robots"
            isWrapped
            right={(
                <div style={{ display: 'flex' }}>
                    {status[1].value === 'Offline' && robot?.robotStatus && (
                        <Tooltip
                            bindListeners
                            content={{ text: 'Offline' }}
                        >
                            <i className="fa fa-user-robot-xmarks" style={{ marginRight: '10px', opacity: 0.75 }}/>
                        </Tooltip>
                    )}
                    <ContextMenu items={CONTEXT_MENU_ITEMS}/>
                </div>
            )}
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
                            Statusinformationen
                        </h3>
                        {status.map(({ name, value, tooltipText }) => (
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                {tooltipText ? (
                                     <Tooltip
                                         bindListeners
                                         content={{ html: <div>{tooltipText}</div> }}
                                     >
                                         <p style={{ marginBottom: '8px' }}>{name}</p>
                                     </Tooltip>
                                ) : <p>{name}</p>}
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
