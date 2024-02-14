import React from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button ,Tooltip } from 'chayns-components';
import { setIsEditingMap } from '../../../../redux-modules/misc/actions';

const EditMapButton = () => {
    const dispatch = useDispatch();

    return (
        <Tooltip
            bindListeners
            content={{ text: 'Stockwerk bearbeiten' }}
        >
            <Button
                className={clsx('icon-button pointer-events button--secondary')}
                onClick={() => {
                    dispatch(setIsEditingMap(true));
                }}
            >
                <i className="far fa-pencil"/>
            </Button>
        </Tooltip>

    );
};

export default EditMapButton;
