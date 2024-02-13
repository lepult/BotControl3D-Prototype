/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useMemo } from 'react';
import { createDialog, DialogButtonType, DialogType } from 'chayns-api';
import clsx from 'clsx';
// @ts-ignore
import { Button, Tooltip } from 'chayns-components';
import { useSelector } from 'react-redux';
import { selectSelectedRobotId } from '../../../../../redux-modules/map/selectors';
import { postChargeRobotFetch } from '../../../../../api/robot/postChargeRobot';
import { selectRobotById } from '../../../../../redux-modules/robot-status/selectors';
import { getMapRobotStatus } from '../../../../../utils/robotStatusHelper';
import { MapRobotStatus } from '../../../../../types/deckgl-map';
import { CustomDestinationType } from '../../../../../types/api/destination';

const ChargeButton = () => {
    const selectedRobotId = useSelector(selectSelectedRobotId);
    const selectedRobot = useSelector(selectRobotById(selectedRobotId || ''));
    const mapRobotStatus = useMemo(() => getMapRobotStatus(selectedRobot?.robotStatus, selectedRobot?.puduRobotStatus),
        [selectedRobot]);

    const robotRouteDestinations = useMemo(() => selectedRobot?.robotStatus?.currentRoute?.routeDestinations,
        [selectedRobot]);
    const lastDestinationIsChargingStation = useMemo(() => (robotRouteDestinations || [])[(robotRouteDestinations?.length || 0) - 1]?.destination.customType === CustomDestinationType.chargingStation,
        [robotRouteDestinations]);

    const confirmDialog = createDialog({
        type: DialogType.CONFIRM,
        text: 'Mit dieser Aktion, beendet der Roboter alle aktuellen Lieferaufträge und fährt zur Ladestation.',
        buttons: [{
            type: DialogButtonType.OK,
            text: 'Bestätigen',
        }, {
            type: DialogButtonType.CANCEL,
            text: 'Abbrechen',
        }]
    });

    const errorDialog = createDialog({
        type: DialogType.ALERT,
        text: 'Es ist ein unbekannter Fehler aufgetreten.',
    });

    return (
        <Tooltip
            bindListeners
            content={{ text: 'Zur Ladestation' }}
        >
            <Button
                className={clsx('icon-button pointer-events', {
                    'button--secondary': ![
                        MapRobotStatus.Charging,
                        MapRobotStatus.SendToChargingPile,
                        MapRobotStatus.Charged
                    ].includes(mapRobotStatus) && !lastDestinationIsChargingStation
                })}
                onClick={() => {
                    if (selectedRobotId) {
                        void confirmDialog.open()
                            .then((result) => {
                                // @ts-ignore
                                if (result.buttonType === DialogButtonType.OK) {
                                    postChargeRobotFetch(selectedRobotId)
                                        .catch(() => errorDialog.open());
                                }
                            });

                    }
                }}
                disabled={!selectedRobotId}
            >
                <i className="far fa-battery-bolt"/>
            </Button>
        </Tooltip>
    )
};

export default ChargeButton;
