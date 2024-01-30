/* eslint-disable no-param-reassign */
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setWaitCursor } from 'chayns-api';
import { TMapWithDestinations } from '../../types/api/map';
import { TRobotMap } from '../../types/pudu-api/robotMap';
import { TDestination } from '../../types/api/destination';
import { FetchState } from '../../types/fetch';
import { TRobotStatus } from '../../types/api/robotStatus';
import { TPuduApiRobotStatus } from '../../types/pudu-api/robotStatus';
import { TSyncMapsData } from '../../types/websocket/syncMapsData';
import { TNotifyGoStateData } from '../../types/websocket/notifyGoStateData';
import { getDevicesDataAction, getRobotDataAction } from './actions';
import { sortMapsAndDestinations } from '../../utils/sortHelper';
import { TNotifyRobotPoseData } from '../../types/websocket/notifyRobotPoseData';
import { TNotifyChaynsDeliveryStatus } from '../../types/websocket/notifyChaynsDeliveryStatus';
import { TQueryStateData } from '../../types/websocket/queryStateData';
import { TSyncActivitiesData } from '../../types/websocket/syncActivitiesData';
import { TNotifyRobotPowerData } from '../../types/websocket/notifyRobotPowerData';
import { TNotifyRobotMoveStateData } from '../../types/websocket/notifyRobotMoveStateData';

type TInitialState = {
    fetchState: FetchState;
    sendToDestinations: Array<TDestination>;
};

export type TState = {
    robotId: string;
    groupId?: string;
    robotStatus?: TRobotStatus;
    puduRobotStatus?: TPuduApiRobotStatus;
    mapData?: TRobotMap;
    maps?: Array<TMapWithDestinations>;
    syncMapsData?: TSyncMapsData;
    goStateData?: TNotifyGoStateData;
};

export type TReducerAction<T> = {
    robotId: string;
    data: T;
};

export const robotStatusAdapter = createEntityAdapter<TState>({
    selectId: (model) => model.robotId,
    sortComparer: (a, b) => a.robotId.localeCompare(b.robotId)
});

const slice = createSlice({
    name: 'robotStatus',
    initialState: robotStatusAdapter.getInitialState<TInitialState>({
        fetchState: FetchState.initial,
        sendToDestinations: [],
    }),
    reducers: {
        updateRobotStatus: (draft, action: PayloadAction<TReducerAction<TNotifyChaynsDeliveryStatus>>) => {
            if (action.payload) {
                robotStatusAdapter.updateOne(draft, {
                    id: action.payload.robotId,
                    changes: {
                        robotStatus: action.payload.data.chaynsStatus
                    }
                });
            }
        },
        updateRobotActivity: (draft, action: PayloadAction<TReducerAction<TSyncActivitiesData>>) => {
            if (action.payload) {
                const robot = draft.entities[action.payload.robotId];

                if (robot) {
                    robotStatusAdapter.updateOne(draft, {
                        id: action.payload.robotId,
                        changes: {
                            robotStatus: {
                                ...robot.robotStatus,
                                robotId: action.payload.robotId,
                                currentActivity: action.payload.data.currentActivity
                            }
                        }
                    });
                }
            }
        },
        updatePuduApiStatus: (draft, action: PayloadAction<TReducerAction<TQueryStateData>>) => {
            if (action.payload) {
                robotStatusAdapter.updateOne(draft, {
                    id: action.payload.robotId,
                    changes: {
                        puduRobotStatus: action.payload.data
                    }
                });
            }
        },
        updateRobotPower: (draft, action: PayloadAction<TReducerAction<TNotifyRobotPowerData>>) => {
            if (action.payload) {
                const robot = draft.entities[action.payload.robotId];

                if (robot) {
                    robotStatusAdapter.updateOne(draft, {
                        id: action.payload.robotId,
                        changes: {
                            puduRobotStatus: {
                                ...robot.puduRobotStatus,
                                robotPower: action.payload.data.power,
                                chargeStage: action.payload.data.chargeStage
                            }
                        }
                    });
                }
            }
        },
        updateRobotMoveState: (draft, action: PayloadAction<TReducerAction<TNotifyRobotMoveStateData>>) => {
            if (action.payload) {
                const robot = draft.entities[action.payload.robotId];

                if (robot) {
                    robotStatusAdapter.updateOne(draft, {
                        id: action.payload.robotId,
                        changes: {
                            puduRobotStatus: {
                                ...robot.puduRobotStatus,
                                moveState: action.payload.data.state
                            }
                        }
                    });
                }
            }
        },
        updateRobotPose: (draft, action: PayloadAction<TReducerAction<TNotifyRobotPoseData>>) => {
            if (action.payload) {
                const robot = draft.entities[action.payload.robotId];

                if (robot) {
                    robotStatusAdapter.updateOne(draft, {
                        id: action.payload.robotId,
                        changes: {
                            puduRobotStatus: {
                                ...robot.puduRobotStatus,
                                robotPose: action.payload.data
                            }
                        }
                    });
                }
            }
        },
        updateSendToDestinations: (draft, { payload }: PayloadAction<Array<TDestination>>) => ({
            ...draft,
            sendToDestinations: payload
        }),
    },
    extraReducers: (builder) => {
        // region fetch initial data
        // TODO Add loading behavior
        builder.addCase(getDevicesDataAction.pending, (draft) => ({
            ...draft,
            fetchState: FetchState.pending
        }));
        builder.addCase(getDevicesDataAction.fulfilled, (draft, { payload }) => {
            if (payload) {
                let foundRobots = false;
                payload.devices.forEach((device) => {
                    device.groups.forEach((group) => {
                        if (group.robots.length > 0) {
                            foundRobots = true;

                            group.robots.forEach((r) => {
                                robotStatusAdapter.upsertOne(draft, {
                                    robotId: r.id,
                                    groupId: group.id
                                });
                            });
                        }
                    });
                });

                // Disable wait cursor if no robot is available
                if (!foundRobots) {
                    return {
                        ...draft,
                        fetchState: FetchState.fulfilled
                    }
                }
            }
            return draft;
        });
        builder.addCase(getDevicesDataAction.rejected, (draft) => ({
            ...draft,
            fetchState: FetchState.rejected
        }));

        builder.addCase(getRobotDataAction.pending, (draft) => ({
            ...draft,
            fetchState: FetchState.pending
        }));
        builder.addCase(getRobotDataAction.fulfilled, (draft, { payload, meta }) => {
            if (payload) {
                const sortedMaps = sortMapsAndDestinations(payload.maps);

                robotStatusAdapter.upsertOne(draft, {
                    robotId: meta.arg.robotId,
                    robotStatus: payload.robotStatus,
                    puduRobotStatus: payload.puduRobotStatus,
                    maps: sortedMaps,
                    mapData: payload.map
                });
            }
        });
        builder.addCase(getRobotDataAction.rejected, (draft) => ({
            ...draft,
            fetchState: FetchState.rejected
        }));

        //
        // builder.addCase(fetchMapsForRobot.pending, (draft) => ({
        //     ...draft,
        //     fetchState: FetchState.PENDING
        // }));
        // builder.addCase(fetchMapsForRobot.fulfilled, (draft, { payload }) => {
        //     draft.fetchState = FetchState.FETCHED;
        //
        //     if (payload) {
        //         const sortedMaps = sortMapsAndDestinations(payload.maps);
        //         robotStatusAdapter.updateOne(draft, {
        //             id: payload.robotId,
        //             changes: {
        //                 maps: sortedMaps
        //             }
        //         });
        //     }
        // });
        // builder.addCase(fetchMapsForRobot.rejected, (draft) => ({
        //     ...draft,
        //     fetchState: FetchState.ERROR
        // }));
        // endregion
    }
});

export const {
    updateRobotStatus,
    updateRobotActivity,
    updatePuduApiStatus,
    updateRobotPower,
    updateRobotMoveState,
    updateRobotPose,
    updateSendToDestinations,
} = slice.actions;

export const robotStatusReducer = slice.reducer;
export const robotStatusName = slice.name;
