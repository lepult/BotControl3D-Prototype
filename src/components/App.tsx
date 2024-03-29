import React, { useEffect, useState } from 'react';
import { setRefreshScrollEnabled, useIsAdminMode } from 'chayns-api';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import AdminMode from './admin/AdminMode';
import { getAllMapsAction } from '../redux-modules/map/actions';
import { getAllDestinationsAction } from '../redux-modules/destination/actions';
import { selectRobotIds } from '../redux-modules/robot-status/selectors';
import { getDevicesDataAction, getRobotDataAction } from '../redux-modules/robot-status/actions';
import UserMode from './user/UserMode';
import addWebsocket from '../utils/websocket/websocketHelper';
import { useProductionBackend } from '../constants/env';
import {
    updatePuduApiStatus,
    updateRobotActivity, updateRobotMoveState,
    updateRobotPose, updateRobotPower,
    updateRobotStatus
} from '../redux-modules/robot-status/slice';
import { TNotifyRobotPoseData } from '../types/websocket/notifyRobotPoseData';
import { TQueryStateData } from '../types/websocket/queryStateData';
import { TNotifyChaynsDeliveryStatus } from '../types/websocket/notifyChaynsDeliveryStatus';
import { TSyncActivitiesData } from '../types/websocket/syncActivitiesData';
import { TNotifyRobotPowerData } from '../types/websocket/notifyRobotPowerData';
import { TNotifyRobotMoveStateData } from '../types/websocket/notifyRobotMoveStateData';
import './app.scss';
import Map from './map/Map';
import EditorMapButtons from './map/editor-map-buttons/EditorMapButtons';
import { selectIsEditingMap } from '../redux-modules/misc/selectors';
import { selectSelectedMap } from '../redux-modules/map/selectors';
import { ModelType } from '../constants/hardcoded-data/models';
import { TViewState } from '../types/deckgl-map';
import { ChaynsViewMode, removeChaynsFooter, updateChaynsViewmode } from '../utils/chaynsHelper';

const App = () => {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const isAdminMode = useIsAdminMode();
    const isEditingMap = useSelector(selectIsEditingMap);
    const mapId = useSelector(selectSelectedMap);

    const robotIds = useSelector(selectRobotIds);

    useEffect(() => {
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
                        query_state: (data: TQueryStateData) => {
                            dispatch(updatePuduApiStatus({
                                robotId: robotId as string,
                                data
                            }));
                        },
                        notify_robot_pose: (data: TNotifyRobotPoseData) => {
                            dispatch(updateRobotPose({
                                robotId: robotId as string,
                                data,
                            }));
                        },
                        sync_activities: (data: TSyncActivitiesData) => {
                            void dispatch(updateRobotActivity({
                                robotId: robotId as string,
                                data
                            }));
                        },
                        notify_robot_power: (data: TNotifyRobotPowerData) => {
                            dispatch(updateRobotPower({
                                robotId: robotId as string,
                                data
                            }));
                        },
                        notify_robot_move_state: (data: TNotifyRobotMoveStateData) => {
                            dispatch(updateRobotMoveState({
                                robotId: robotId as string,
                                data
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

    useEffect(() => {
        if (isAdminMode && !isEditingMap) {
            updateChaynsViewmode(ChaynsViewMode.exclusive);
            removeChaynsFooter(false);
            void setRefreshScrollEnabled(true);
        } else {
            updateChaynsViewmode(ChaynsViewMode.wide);
            removeChaynsFooter(true);
            void setRefreshScrollEnabled(false);
        }
    }, [isAdminMode, isEditingMap]);

    const [floorModels, setFloorModels] = useState<ModelType[]>([]);
    const [viewState, setViewState] = useState<TViewState>();

    if (isEditingMap && mapId) {
        return (
            <div>
                <Map
                    mapId={mapId}
                    isEditor
                    setFloorModels={setFloorModels}
                    setViewState={setViewState}
                />
                <EditorMapButtons
                    floorModels={floorModels}
                    viewState={viewState}
                    mapId={mapId}
                />
            </div>
        )
    }

    return isAdminMode
        ? <AdminMode/>
        : <UserMode/>;
};

export default App;
