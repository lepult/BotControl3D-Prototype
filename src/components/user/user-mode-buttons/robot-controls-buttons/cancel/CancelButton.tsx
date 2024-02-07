/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useMemo } from 'react';
// @ts-ignore
import { Button } from 'chayns-components';
import { useSelector } from 'react-redux';
import { createDialog, DialogButtonType, DialogType } from 'chayns-api';
import { selectSelectedRobotId } from '../../../../../redux-modules/map/selectors';
import { postCancelRobotFetch } from '../../../../../api/robot/postCancelRobot';
import { selectRobotById } from '../../../../../redux-modules/robot-status/selectors';
import { getMapRobotStatus } from '../../../../../utils/robotStatusHelper';
import clsx from 'clsx';
import { MapRobotStatus } from '../../../../../types/deckgl-map';

const CancelButton = () => {
    const confirmDialog = createDialog({
        type: DialogType.CONFIRM,
        text: 'Mit dieser Aktion, beendet der Roboter alle aktuellen Lieferaufträge.',
        buttons: [{
            type: DialogButtonType.OK,
            text: 'Bestätigen',
        }, {
            type: DialogButtonType.CANCEL,
            text: 'Abbrechen',
        }]
    });

    const selectedRobotId = useSelector(selectSelectedRobotId);
    const selectedRobot = useSelector(selectRobotById(selectedRobotId || ''));
    const mapRobotStatus = useMemo(() => getMapRobotStatus(selectedRobot?.robotStatus, selectedRobot?.puduRobotStatus),
        [selectedRobot]);

    const errorDialog = createDialog({
        type: DialogType.ALERT,
        text: 'Es ist ein Fehler aufgetreten',
    });

    return (
        <Button
            className={clsx('icon-button pointer-events', {
                'button--secondary': ![
                    MapRobotStatus.Cancel,
                ].includes(mapRobotStatus)
            })}
            onClick={() => {
                if (selectedRobotId) {
                    void confirmDialog.open()
                        .then((result) => {
                            // @ts-ignore
                            if (result.buttonType === DialogButtonType.OK) {
                                postCancelRobotFetch(selectedRobotId)
                                    .catch(() => errorDialog.open());
                            }
                        });

                }
            }}
            disabled={!selectedRobotId}
        >
            <i className="far fa-ban"/>
        </Button>
    )
};

export default CancelButton;
