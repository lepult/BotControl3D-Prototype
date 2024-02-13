import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button, Tooltip } from 'chayns-components';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { resetViewState } from '../../../../redux-modules/misc/actions';

const ResetViewButton = () => {
    const dispatch = useDispatch();

    return (
        <Tooltip
            bindListeners
            content={{ text: 'Kameraposition zurücksetzen' }}
        >
            <Button
                className={clsx('icon-button pointer-events button--secondary')}
                onClick={() => dispatch(resetViewState())}
            >
                <i className="far fa-location-crosshairs"/>
            </Button>
        </Tooltip>

    )
};

export default ResetViewButton;
