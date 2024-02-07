import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button } from 'chayns-components';
import { createDialog, DialogButtonType, DialogType } from 'chayns-api';
import clsx from 'clsx';

const ImportButton = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <Button
            className={clsx('icon-button pointer-events', {
                'button--secondary': !isDialogOpen,
            })}
            onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.glb';
                input.onchange = _ => {
                    console.log('FileList', input.files);
                    // TODO Upload to chayns Space.
                    void createDialog({
                        type: DialogType.ALERT,
                        text: "Das Importieren von Dateien ist nicht implementiert.",
                        buttons: [{ type: DialogButtonType.CANCEL, text: 'Schließen' }],
                    }).open().finally(() => setIsDialogOpen(false));
                };
                input.click();
                setIsDialogOpen(true);
            }}
        >
            <i className="fa fa-file-arrow-up"/>
        </Button>
    );
}

export default ImportButton;
