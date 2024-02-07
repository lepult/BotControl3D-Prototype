import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button } from 'chayns-components';
import { toggleFollowRobot } from '../../../../../redux-modules/map/actions';
import { selectFollowRobot, selectSelectedRobotId } from '../../../../../redux-modules/map/selectors';

const FollowRobotButton = () => {
    const dispatch = useDispatch();

    const selectedRobotId = useSelector(selectSelectedRobotId);
    const followRobot = useSelector(selectFollowRobot);

    return (
        <Button
            disabled={!selectedRobotId}
            className={clsx('icon-button pointer-events', {
                'button--secondary': !followRobot,
            })}
            onClick={() => dispatch(toggleFollowRobot())}
        >
            <i className="far fa-cctv"/>
        </Button>
    );
};

export default FollowRobotButton;
