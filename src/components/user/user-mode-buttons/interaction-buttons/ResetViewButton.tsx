import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button } from 'chayns-components';

const ResetViewButton = () => {
    const dispatch = useDispatch();

    return (
        <Button
            className={clsx('icon-button pointer-events')}
            onClick={() => console.log('center view')}
        >
            <i className="far fa-location-crosshairs"/>
        </Button>
    );
};

export default ResetViewButton;
