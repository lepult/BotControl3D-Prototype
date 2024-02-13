import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { setAdminMode } from 'chayns-api';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Button ,Tooltip } from 'chayns-components';
import { changeAdminModeType } from '../../../../redux-modules/misc/actions';
import { selectSelectedMap } from '../../../../redux-modules/map/selectors';
import { AdminModeType } from '../../../../types/misc';

const EditMapButton = () => {
    const dispatch = useDispatch();
    const mapId = useSelector(selectSelectedMap);

    return (
        <Tooltip
            bindListeners
            content={{ text: 'Stockwerk bearbeiten' }}
        >
            <Button
                className={clsx('icon-button pointer-events button--secondary')}
                onClick={() => {
                    dispatch(changeAdminModeType({
                        adminModeType: AdminModeType.editMap,
                        editingMapId: mapId,
                    }));
                    void setAdminMode(true);
                }}
            >
                <i className="far fa-pencil"/>
            </Button>
        </Tooltip>

    );
};

export default EditMapButton;
