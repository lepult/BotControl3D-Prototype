import React, { FC } from 'react';
// @ts-ignore
import { Accordion, SmallWaitCursor, ContextMenu } from 'chayns-components';
import { useSelector } from 'react-redux';
import { selectRobotStatusById } from '../../../redux-modules/robot-status/selectors';
import FloorPreview from '../floors-list/FloorPreview';
import FloorLocations from '../floors-list/FloorLocations';

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
    console.log('robotStatus', robotStatus?.robotName, robotStatus)
    return (
        <Accordion
            head={robotStatus?.robotName || <SmallWaitCursor show/>}
            dataGroup="robots"
            isWrapped
            right={<ContextMenu items={CONTEXT_MENU_ITEMS}/>}
        >
            {robotStatus ? (
                <div>
                    {robotStatus.currentMap?.id && (
                        <div>
                            <div className="accordion__content">
                                <FloorPreview mapId={robotStatus.currentMap.id}/>
                            </div>
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
                        defaultOpened
                        isWrapped
                        dataGroup="robot-item"
                    >
                        <div className="accordion__content">
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <p>Roboter-Id</p>
                                <p>{robotId}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <p>Position</p>
                                <p>{robotStatus.currentMap?.showName || 'Unbekannt'}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <p>Neustart-Zeit</p>
                                <p>{robotStatus.rebootTime || 'Unbekannt'}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <p>Calling Code</p>
                                <p>{robotStatus.callingCode?.code || 'Unbekannt'}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <p>Modus</p>
                                <p>{robotStatus.driveMode || 'Unbekannt'}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <p>Ausgabepunkt</p>
                                <p>{robotStatus.diningOutlet?.name || 'Unbekannt'}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <p>Ladestation</p>
                                <p>{robotStatus.chargingStation?.name || 'Unbekannt'}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <p>Homebase</p>
                                <p>{robotStatus.homeBaseMap?.showName || 'Unbekannt'}</p>
                            </div>
                        </div>
                    </Accordion>
                </div>
            ) : (
                <SmallWaitCursor show/>
            )}
        </Accordion>
    )
};

export default RobotItem;