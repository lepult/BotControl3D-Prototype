import React, { FC } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button } from 'chayns-components';
import { useDispatch } from 'react-redux';
import { changeAdminModeType, resetViewState } from '../../../redux-modules/misc/actions';
import { changeInitialViewState } from '../../../redux-modules/map/actions';
import { AdminModeType } from '../../../types/misc';
import { ModelType } from '../../../constants/models';
import { TViewState } from '../../../types/deckgl-map';
import { createDialog, DialogButtonType, DialogType } from 'chayns-api';

const EditorMapButtons: FC<{
    floorModels: ModelType[],
    viewState: TViewState | undefined,
    mapId: number,
}> = ({
    floorModels,
    viewState,
    mapId,
}) => {
    const dispatch = useDispatch();

    return (
        <div>
            <Button
                onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.glb';
                    input.onchange = _ => {
                        console.log('FileList', input.files);
                        console.log('Array', Array.prototype.slice.call(input.files));
                        // TODO Upload to chayns Space.
                        void createDialog({
                            type: DialogType.ALERT,
                            text: "Das Importieren von Dateien ist nicht implementiert.",
                            buttons: [{ type: DialogButtonType.CANCEL, text: 'Schließen' }],
                        }).open();
                    };
                    input.click();
                }}
            >
                Import
            </Button>
            <Button
                onClick={() => dispatch(resetViewState())}
            >
                Reset View
            </Button>
            <Button
                onClick={() => {
                    const newInitialViewState = {
                        bearing: viewState?.bearing || 0,
                        latitude: viewState?.latitude || 0,
                        longitude: viewState?.longitude || 0,
                        pitch: viewState?.pitch || 0,
                        zoom: viewState?.zoom || 21,
                    };
                    console.log('newInitialViewState', newInitialViewState);
                    dispatch(changeInitialViewState({
                        mapId,
                        viewState: newInitialViewState,
                    }))
                }}
            >
                Initialen ViewState setzen
            </Button>
            <Button
                onClick={() => {
                    console.log('Models', floorModels);
                    dispatch(changeAdminModeType({ adminModeType: AdminModeType.default }));
                    void createDialog({
                        type: DialogType.ALERT,
                        text: "Das Speichern der Modelle ist nicht implementiert. Mit dem Neuladen der Seite werden die Positionen zurückgesetzt.",
                        buttons: [{ type: DialogButtonType.CANCEL, text: 'Schließen' }],
                    }).open();
                }}
            >
                Speichern
            </Button>
        </div>
    )
};

export default EditorMapButtons;
