import { TRobotActivity } from '../api/robotStatus';

export type TSyncActivitiesData = {
    lastActivity: TRobotActivity;
    currentActivity: TRobotActivity;
};
