import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button } from 'chayns-components';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { resetViewState } from '../../../../redux-modules/misc/actions';

const ResetViewButton = () => {
    const dispatch = useDispatch();

    return (
        <Button
            className={clsx('icon-button pointer-events button--secondary')}
            onClick={() => dispatch(resetViewState())}
        >
            <i className="fa fa-location-crosshairs"/>
        </Button>
    )
};

export default ResetViewButton;
