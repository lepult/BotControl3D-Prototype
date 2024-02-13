import React, { FC } from 'react';
import { createDialog, DialogButtonType, DialogResult, DialogType } from 'chayns-api';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button } from 'chayns-components';
import clsx from 'clsx';

type TDialogResult = {
    buttonType: DialogButtonType
}

const CancelButton: FC = () => (
    <Button
        className={clsx('pointer-events')}
        onClick={() => {
            void createDialog({
                type: DialogType.ALERT,
                text: "Willst du das Bearbeiten wirklich abbrechen. Geänderte Einstellungen gehen verloren.",
                buttons: [{
                    type: DialogButtonType.OK,
                    text: 'Bestätigen'
                }, {
                    type: DialogButtonType.CANCEL,
                    text: 'Abbrechen'
                }],
            }).open().then((response) => {
                const { buttonType } = response as TDialogResult
                if (buttonType === DialogButtonType.OK) {
                    window.location.reload();
                }
            });
        }}
    >
        Abbrechen
    </Button>
);

export default CancelButton;
