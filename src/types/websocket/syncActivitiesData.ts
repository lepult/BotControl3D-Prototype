// region Imports
import { TRobotActivity } from '../api/robotStatus';
// endregion

export type TSyncActivitiesData = {
    lastActivity: TRobotActivity;
    currentActivity: TRobotActivity;
};
