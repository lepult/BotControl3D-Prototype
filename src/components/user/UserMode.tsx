/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { setRefreshScrollEnabled } from 'chayns-api';
// @ts-ignore
import { SmallWaitCursor } from 'chayns-components';
import { ChaynsViewMode, removeFooter, updateChaynsViewmode } from '../../utils/pageSizeHelper';
import UserModeMap from './user-mode-map/UserModeMap';
import UserModeButtons from './user-mode-buttons/UserModeButtons';
import { selectMapsFetchState, selectSelectedMap } from '../../redux-modules/map/selectors';
import { FetchState } from '../../types/fetch';

const UserMode = () => {
    useEffect(() => {
        updateChaynsViewmode(ChaynsViewMode.wide);
        removeFooter(true);
        void setRefreshScrollEnabled(false);
    }, []);

    const selectedMap = useSelector(selectSelectedMap);
    const mapFetchState = useSelector(selectMapsFetchState);

    return (
        <div>
            <UserModeButtons/>
            {mapFetchState === FetchState.pending && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%'
                    }}
                >
                    <SmallWaitCursor show/>
                </div>
            )}
            {selectedMap
                ? <UserModeMap mapId={selectedMap}/>
                : <div>Fehler</div>}

        </div>
    );
};

export default UserMode;
