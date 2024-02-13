import React, { FC } from 'react';
import { ModelType } from '../../../constants/hardcoded-data/models';
import { TViewState } from '../../../types/deckgl-map';
import '../buttons.scss';
import ImportButton from './buttons/ImportButton';
import ChangeInitialViewButton from './buttons/ChangeInitialViewButton';
import SaveButton from './buttons/SaveButton';
import ResetViewButton from './buttons/ResetViewButton';
import CancelButton from './buttons/CancelButton';

const EditorMapButtons: FC<{
    floorModels: ModelType[],
    viewState: TViewState | undefined,
    mapId: number,
}> = ({
    floorModels,
    viewState,
    mapId,
}) => (
    <div className="user-mode-buttons__wrapper">
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
            }}
        >
            <div
                className="map-buttons"
                style={{
                    alignItems: 'end',
                    top: 0,
                    left: 0,
                    right: 0,
                    padding: '10px',
                }}
            >
                <ImportButton/>
                <ResetViewButton/>
                <ChangeInitialViewButton viewState={viewState} mapId={mapId}/>
            </div>
            <div
                className="map-buttons"
                style={{
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <SaveButton floorModels={floorModels}/>
                <div style={{ marginLeft: '10px' }}>
                    <CancelButton/>
                </div>
            </div>
        </div>
    </div>

);

export default EditorMapButtons;
