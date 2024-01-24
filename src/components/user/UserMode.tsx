/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
// @ts-ignore
import { SmallWaitCursor } from 'chayns-components';
import { ChaynsViewMode, updateChaynsViewmode } from '../../utils/pageSizeHelper';
import UserModeMap from './UserModeMap';
import UserModeButtons from './UserModeButtons';
import { selectMapsFetchState, selectSelectedMap } from '../../redux-modules/map/selectors';
import { FetchState } from '../../types/fetch';

const UserMode = () => {
    useEffect(() => {
        updateChaynsViewmode(ChaynsViewMode.wide);
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
