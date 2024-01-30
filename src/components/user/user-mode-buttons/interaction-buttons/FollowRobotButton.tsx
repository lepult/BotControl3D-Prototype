import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button } from 'chayns-components';
import { toggleFollowRobot } from '../../../../redux-modules/map/actions';
import { selectFollowRobot, selectSelectedRobot } from '../../../../redux-modules/map/selectors';

const FollowRobotButton = () => {
    const dispatch = useDispatch();

    const selectedRobot = useSelector(selectSelectedRobot);
    const followRobot = useSelector(selectFollowRobot);

    return (
        <Button
            disabled={!selectedRobot}
            className={followRobot ? '' : 'button--secondary'}
            onClick={() => dispatch(toggleFollowRobot())}
        >
            <i className="far fa-cctv"/>
        </Button>
    );
};

export default FollowRobotButton;
