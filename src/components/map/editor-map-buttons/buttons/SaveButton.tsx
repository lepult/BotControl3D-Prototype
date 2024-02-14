import React, { FC } from 'react';
import { createDialog, DialogButtonType, DialogType } from 'chayns-api';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button } from 'chayns-components';
import clsx from 'clsx';
import { setIsEditingMap } from '../../../../redux-modules/misc/actions';
import { ModelType } from '../../../../constants/hardcoded-data/models';

const SaveButton: FC<{
    floorModels: ModelType[],
}> = ({
    floorModels,
}) => {
    const dispatch = useDispatch();

    return (
        <Button
            className={clsx('pointer-events')}
            onClick={() => {
                console.log('Models', floorModels);
                void createDialog({
                    type: DialogType.ALERT,
                    text: "Geänderte Einstellungen werden nicht im Backend gespeichert. Mit dem Neuladen der Seite werden die Positionen deshalb zurückgesetzt.",
                    buttons: [{ type: DialogButtonType.CANCEL, text: 'Schließen' }],
                }).open().finally(() => dispatch(setIsEditingMap(false)));
            }}
        >
            Speichern
        </Button>
    )
};

export default SaveButton;
