import React from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button ,Tooltip } from 'chayns-components';
import { resetViewState } from '../../../../redux-modules/misc/actions';
import { setFollowRobot } from '../../../../redux-modules/map/actions';

const ResetViewButton = () => {
    const dispatch = useDispatch();

    return (
        <Tooltip
            bindListeners
            content={{ text: 'Kameraposition zurücksetzen' }}
        >
            <Button
                className={clsx('icon-button pointer-events button--secondary')}
                onClick={() => {
                    dispatch(resetViewState());
                    dispatch(setFollowRobot({ followRobot: false }));
                }}
            >
                <i className="far fa-location-crosshairs"/>
            </Button>
        </Tooltip>

    );
};

export default ResetViewButton;
