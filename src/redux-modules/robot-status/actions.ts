// region deviceActions
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getDevicesWithGroupsAndRobotsFetch } from '../../api/device/getDevicesWithGroupsAndRobots';
import { getRobotDataFetch } from '../../api/robot/getRobotData';

interface IParamRobotId {
    robotId: string;
}
export const getDevicesDataAction = createAsyncThunk(
    'robot-status/devices',
    async () => getDevicesWithGroupsAndRobotsFetch(),
);

export const getRobotDataAction = createAsyncThunk(
    'robot-status/robot-data',
    async (arg: IParamRobotId) => getRobotDataFetch(arg.robotId),
);
