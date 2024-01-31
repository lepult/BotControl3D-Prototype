import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button } from 'chayns-components';
import { resetViewState } from '../../../../redux-modules/misc/actions';

const ResetViewButton = () => {
    const dispatch = useDispatch();

    return (
        <Button
            className={clsx('icon-button pointer-events button--secondary')}
            onClick={() => dispatch(resetViewState())}
        >
            <i className="far fa-location-crosshairs"/>
        </Button>
    );
};

export default ResetViewButton;
