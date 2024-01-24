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
import UserMode from './user/UserMode';

const App = () => {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const isAdminMode = useIsAdminMode();

    const robotIds = useSelector(selectRobotIds);

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

    return isAdminMode
        ? <AdminMode/>
        : <UserMode/>;
};

export default App;
