/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { setRefreshScrollEnabled } from 'chayns-api';
// @ts-ignore
import { SmallWaitCursor } from 'chayns-components';
import { ChaynsViewMode, removeChaynsFooter, updateChaynsViewmode } from '../../utils/chaynsHelper';
import Map from '../map/Map';
import { selectMapsFetchState, selectSelectedMap } from '../../redux-modules/map/selectors';
import { FetchState } from '../../types/fetch';
import UserModeButtons from '../map/user-mode-buttons/UserModeButtons';

const UserMode = () => {
    useEffect(() => {
        updateChaynsViewmode(ChaynsViewMode.wide);
        removeChaynsFooter(true);
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
                        height: '100vh',
                        width: '100%'
                    }}
                >
                    <SmallWaitCursor show/>
                </div>
            )}
            {selectedMap && <Map mapId={selectedMap}/>}
        </div>
    );
};

export default UserMode;
