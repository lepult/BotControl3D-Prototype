import React, { FC, useMemo, useState } from 'react';
import { createDialog, DateType, DialogInputType, DialogType } from 'chayns-api';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Accordion, Button, ContextMenu, SmallWaitCursor, Tooltip } from 'chayns-components';
import { useSelector } from 'react-redux';
import { selectRobotById } from '../../../redux-modules/robot-status/selectors';
import Preview from '../shared/Preview';
import { PreviewType } from '../../../types/deckgl-map';
import { getMapRobotStatus } from '../../../utils/robotStatusHelper';
import { RobotType } from '../../../constants/enums/robotType';
import { RootState } from '../../../redux-modules';
import { selectDestinationsByCustomType } from '../../../redux-modules/destination/selectors';
import { CustomDestinationType } from '../../../types/api/destination';

const getRobotTypeName = (robotType?: RobotType) => {
    switch (robotType) {
        case RobotType.KettyBot:
            return 'KettyBot';
        case RobotType.SwiftBot:
            return 'SwiftBot';
        case RobotType.PuduBot2:
            return 'PuduBot2';
        default:
            return 'Unbekannt';
    }
}

const RobotItem: FC<{
    robotId: string
}> = ({
    robotId,
}) => {
    const robot = useSelector(selectRobotById(robotId));
    const [showMapPreview, setShowMapPreview] = useState(false);
    const hasMap = useMemo(() => robot?.robotStatus?.currentMap?.id && robot?.puduRobotStatus?.robotPose,[robot]);
    const diningOutlets = useSelector((state: RootState) => selectDestinationsByCustomType(state, CustomDestinationType.diningOutlet));
    const charginStations = useSelector((state: RootState) => selectDestinationsByCustomType(state, CustomDestinationType.chargingStation));

    const contextMenuItems = [{
        text: 'Name ändern',
        icon: 'fa fa-pencil',
        onClick: () => {
            void createDialog({
                type: DialogType.INPUT,
                text: 'Gib einen neuen Namen ein.',
                defaultValue: robot?.robotStatus?.robotName,
                placeholder: 'Name',
                inputType: DialogInputType.TEXT,
            }).open();
        },
    }, {
        text: 'Roboter-Typ ändern',
        icon: 'fa fa-pencil',
        onClick: () => {
            void createDialog({
                type: DialogType.SELECT,
                text: 'Wähle einen Roboter-Typ aus.',
                list: [{
                    name: getRobotTypeName(RobotType.KettyBot),
                    id: RobotType.KettyBot,
                    isSelected: robot?.robotStatus?.robotType === RobotType.KettyBot,
                }, {
                    name: getRobotTypeName(RobotType.SwiftBot),
                    id: RobotType.SwiftBot,
                    isSelected: robot?.robotStatus?.robotType === RobotType.SwiftBot,
                }, {
                    name: getRobotTypeName(RobotType.PuduBot2),
                    id: RobotType.PuduBot2,
                    isSelected: robot?.robotStatus?.robotType === RobotType.PuduBot2,
                }]
            }).open();
        },
    }, {
        text: 'Neustart-Zeit ändern',
        icon: 'fa fa-power-off',
        onClick: () => {
            const date = new Date();

            if (robot?.robotStatus?.rebootTime) {
                let totalSeconds = robot.robotStatus.rebootTime * 60;
                const hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                date.setHours(hours, minutes, seconds)
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            void createDialog({
                type: DialogType.DATE,
                dateType: DateType.TIME,
                preselect: date,
                text: 'Wähle eine Uhrzeit aus, zu der der Roboter neu gestartet werden soll.',
            }).open();
        },
    }, {
        text: 'Calling Code anpassen',
        icon: 'fa fa-qrcode',
        onClick: () => {
            void createDialog({
                type: DialogType.INPUT,
                text: 'Gib einen Calling Code an, der auf dem Roboter Display angezeigt werden soll.',
                defaultValue: robot?.robotStatus?.callingCode?.code,
                placeholder: 'Calling Code',
                inputType: DialogInputType.TEXT,
            }).open();
        },    }, {
        text: 'Ausgabepunkt ändern',
        icon: 'fa fa-location-dot',
        onClick: () => {
            void createDialog({
                type: DialogType.SELECT,
                text: 'Wähle einen neuen Ausgabepunkt.',
                quickfind: true,
                list: diningOutlets.map((d) => ({
                    name: d.destination.name,
                    id: d.destination.id,
                    isSelected: d.destination.id === robot?.robotStatus?.diningOutlet?.id,
                }))
            }).open();
        },
    }, {
        text: 'Ladestation ändern',
        icon: 'fa fa-charging-station',
        onClick: () => {
            void createDialog({
                type: DialogType.SELECT,
                text: 'Wähle einen neuen Ladestation.',
                quickfind: true,
                list: charginStations.map((d) => ({
                    name: d.destination.name,
                    id: d.destination.id,
                    isSelected: d.destination.id === robot?.robotStatus?.chargingStation?.id,
                }))
            }).open();
        },
    }, {
        text: 'Homebase ändern',
        icon: 'fa fa-house',
        onClick: () => {
            void createDialog({
                type: DialogType.SELECT,
                text: 'Wähle einen neue Homebase.',
                list: (robot?.maps || []).map((map) => ({
                    name: map.showName || '',
                    id: map.id,
                    isSelected: map.id === robot?.robotStatus?.homeBaseMap?.id,
                })),
            }).open();
        },
    }];

    const status = useMemo(() => [{
        name: 'Status',
        value: getMapRobotStatus(robot?.robotStatus, robot?.puduRobotStatus) || 'Offline'
    }, {
        name: 'Roboter-Id',
        value: robotId
    }, {
        name: 'Roboter-Typ',
        value: getRobotTypeName(robot?.robotStatus?.robotType),
    }, {
        name: 'aktuelles Stockwerk',
        value: robot?.robotStatus?.currentMap?.showName || '-',
        tooltipText: 'Das Stockwerk in dem sich der Roboter aktuell befindet.',
    }, {
        name: 'Neustart-Zeit',
        value: robot?.robotStatus?.rebootTime
            ? `${new Date(robot.robotStatus.rebootTime * 1000 * 60).toISOString().slice(11, 16)} Uhr`
            : '-',
        tooltipText: 'Zu dieser Uhrzeit wird der Roboter täglich neugestartet.',
    }, {
        name: 'Calling Code',
        value: robot?.robotStatus?.callingCode?.code || '-',
        tooltipText: 'Der eingestellte Calling Code wird auf dem Display des Roboters angezeigt.',
    }, {
        name: 'Ausgabepunkt',
        value: robot?.robotStatus?.diningOutlet?.name || '-',
        tooltipText: 'Zu diesem Standort fährt der Roboter im DiningOutlet Fahrt-Modus, um Gegenstände abzuholen.',
    }, {
        name: 'Ladestation',
        value: robot?.robotStatus?.chargingStation?.name || '-',
        tooltipText: 'Diese Ladestation nutzt der Roboter beim Aufladen.',
    }, {
        name: 'Homebase',
        value: robot?.robotStatus?.homeBaseMap?.showName || '-',
        tooltipText: 'Das Stockwerk von dem der Roboter aus arbeitet.',
    }], [robot, robotId]);

    return (
        <Accordion
            head={robot?.robotStatus
                ? robot?.robotStatus?.robotName
                : <div style={{ display: 'flex' }}><SmallWaitCursor show/></div>
            }
            dataGroup="robots"
            isWrapped
            right={robot?.robotStatus && (
                <div style={{ display: 'flex' }}>
                    {status[0].value === 'Offline' && robot?.robotStatus && (
                        <Tooltip
                            bindListeners
                            content={{ text: 'Offline' }}
                        >
                            <i className="fa fa-user-robot-xmarks" style={{ marginRight: '10px', opacity: 0.75 }}/>
                        </Tooltip>
                    )}
                    <ContextMenu items={contextMenuItems}/>
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
                <div
                    style={{
                        height: '200px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <SmallWaitCursor show/>
                </div>
            )}
        </Accordion>
    )
};

export default RobotItem;
