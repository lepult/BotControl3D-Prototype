import React, { useEffect } from 'react';
import { useIsAdminMode } from 'chayns-api';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import AdminMode from './admin/AdminMode';
import { ChaynsViewMode, updateChaynsViewmode } from '../utils/pageSizeHelper';
import { getAllMapsAction } from '../redux-modules/map/actions';
import { getAllDestinationsAction } from '../redux-modules/destination/actions';
import { selectRobotIds, selectRobotStatus } from '../redux-modules/robot-status/selectors';
import { getDevicesDataAction, getRobotDataAction } from '../redux-modules/robot-status/actions';

const App = () => {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const isAdminMode = useIsAdminMode();

    const robotStatus = useSelector(selectRobotStatus);
    const robotIds = useSelector(selectRobotIds);

    console.log('robotStatus', robotStatus);

    useEffect(() => {
        updateChaynsViewmode(ChaynsViewMode.exclusive);
        void dispatch(getAllMapsAction());
        void dispatch(getAllDestinationsAction());
        void dispatch(getDevicesDataAction());
    }, [dispatch]);

    useEffect(() => {
        if (robotIds.length > 0) {
            robotIds.forEach((id) => {
                void dispatch(getRobotDataAction({ robotId: id as string }));
            });
        }
    }, [dispatch, robotIds]);

    return isAdminMode ? (
        <AdminMode/>
    ) : 'Nutzermodus'
};

export default App;
