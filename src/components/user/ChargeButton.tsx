/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
// @ts-ignore
import { Button, Input, PersonFinder, SimpleWrapperContext } from 'chayns-components';
import { useSelector } from 'react-redux';
import { selectSelectedRobot } from '../../redux-modules/map/selectors';
import { createDialog, DialogButtonType, DialogType } from 'chayns-api';
import { postChargeRobotFetch } from '../../api/robot/postChargeRobot';

const ChargeButton = () => {
    const selectedRobot = useSelector(selectSelectedRobot);
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
        text: 'Es ist ein Fehler aufgetreten',
    });

    return (
        <Button
            onClick={() => {
                if (selectedRobot) {
                    void confirmDialog.open()
                        .then((result) => {
                            // @ts-ignore
                            if (result.buttonType === DialogButtonType.OK) {
                                postChargeRobotFetch(selectedRobot)
                                    .catch(() => errorDialog.open());
                            }
                        });
                   
                }
            }}
            disabled={!selectedRobot}
        >
            <i className="far fa-battery-bolt"/>
        </Button>
    )
};

export default ChargeButton;
