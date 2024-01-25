import React, { useEffect, useState } from 'react';
import { useIsAdminMode } from 'chayns-api';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import AdminMode from './admin/AdminMode';
import { ChaynsViewMode, updateChaynsViewmode } from '../utils/pageSizeHelper';
import { getAllMapsAction } from '../redux-modules/map/actions';
import { getAllDestinationsAction } from '../redux-modules/destination/actions';
import { selectRobotIds } from '../redux-modules/robot-status/selectors';
import { getDevicesDataAction, getRobotDataAction } from '../redux-modules/robot-status/actions';
import UserMode from './user/UserMode';
import addWebsocket from '../utils/websocketHelper';
import { useProductionBackend } from '../constants/env';
import { updatePuduApiStatus, updateRobotPose, updateRobotStatus } from '../redux-modules/robot-status/slice';
import { TNotifyRobotPoseData } from '../types/websocket/notifyRobotPoseData';
import { TQueryStateData } from '../types/websocket/queryStateData';
import { TNotifyChaynsDeliveryStatus } from '../types/websocket/notifyChaynsDeliveryStatus';


const radiansToDegrees = (radians: number) => {
    const pi = Math.PI;
    return radians * (180/pi);
}


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

    const [openedWebsockets, setOpenedWebsockets] = useState<string[]>([]);

    useEffect(() => {
        robotIds
            .filter((robotId) => !openedWebsockets.includes(robotId as string))
            .forEach((robotId) => {
                setOpenedWebsockets((prev) => [
                    ...prev,
                    robotId as string,
                ]);
                addWebsocket({
                    serviceName: 'chayns_bot_control',
                    conditions: {
                        isProduction: useProductionBackend,
                        robotId
                    },
                    events: {

                        chayns_delivery_status: (data: TNotifyChaynsDeliveryStatus) => {
                            void dispatch(updateRobotStatus({
                                robotId: robotId as string,
                                data
                            }));
                        },
                        // Updates after requesting update
                        query_state: (data: TQueryStateData) => {
                            dispatch(updatePuduApiStatus({
                                robotId: robotId as string,
                                data
                            }));
                        },
                        notify_robot_pose: (data: TNotifyRobotPoseData) => {
                            console.log('angle', data.angle, radiansToDegrees(data.angle));
                            dispatch(updateRobotPose({
                                robotId: robotId as string,
                                data,
                            }));
                        },
                    }
                })
            });
    }, [robotIds]);

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
