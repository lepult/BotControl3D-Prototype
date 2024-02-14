import React, { FC } from 'react';
import { createDialog, DialogButtonType, DialogResult, DialogType } from 'chayns-api';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button, Tooltip } from 'chayns-components';
import clsx from 'clsx';

const ShortcutsButton: FC = () => (
    <Tooltip
        bindListeners
        content={{ text: 'Shortcuts' }}
    >
        <Button
            className={clsx('icon-button pointer-events button--secondary')}
            onClick={() => {
                void createDialog({
                    type: DialogType.ALERT,
                    text: `
                        [h1]Shortcuts[/h1]
                        [p]Modell Verschieben: [b]STRG + Linke Maustaste[/b][/p]
                        [p]Modell Rotieren: [b]SHIFT + Linke Maustaste[/b][/p]
                        [p]Rückgängig: [b]STRG + Z[/b][/p]
                        [p]Wiederholen: [b]STRG + Y[/b][/p]
                    `,
                    width: '400px'
                }).open();
            }}
        >
            <i className="far fa-question"/>
        </Button>
    </Tooltip>
);

export default ShortcutsButton;
