import React, { useEffect } from 'react';
import FloorsList from './floors-list/FloorsList';
import { useSelector } from 'react-redux';
import { selectAdminModeType, selectEditingMapId } from '../../redux-modules/misc/selectors';
import EditorMap from '../EditorMap';
import { AdminModeType } from '../../types/misc';
import { ChaynsViewMode, updateChaynsViewmode } from '../../utils/pageSizeHelper';

const AdminMode = () => {
    const adminModeType = useSelector(selectAdminModeType);
    const editingMapId = useSelector(selectEditingMapId);

    useEffect(() => {
        console.log('adminModeType', adminModeType);
        if (adminModeType === AdminModeType.default) {
            updateChaynsViewmode(ChaynsViewMode.exclusive);
        }
    }, [adminModeType]);

    if (adminModeType === AdminModeType.editMap && editingMapId) {
        return (
            <EditorMap mapId={editingMapId} />
        );
    }

    return (
        <div>
            <h1>
                Verwaltung
            </h1>
            <p>
                Mit dieser Ansicht kannst du die Roboter und die Übersicht verwalten. Die Roboter können in dieser Ansicht nicht gesteuert werden.
            </p>
            <FloorsList/>
        </div>
    );
};

export default AdminMode;
