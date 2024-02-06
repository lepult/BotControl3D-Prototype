import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { setRefreshScrollEnabled } from 'chayns-api';
import FloorsList from './floors-list/FloorsList';
import { selectAdminModeType, selectEditingMapId } from '../../redux-modules/misc/selectors';
import EditorMap from './floors-list/editor-map/EditorMap';
import { AdminModeType } from '../../types/misc';
import { ChaynsViewMode, removeFooter, updateChaynsViewmode } from '../../utils/pageSizeHelper';
import RobotsList from './robots-list/RobotsList';

const AdminMode = () => {
    const adminModeType = useSelector(selectAdminModeType);
    const editingMapId = useSelector(selectEditingMapId);

    useEffect(() => {
        if (adminModeType === AdminModeType.default) {
            updateChaynsViewmode(ChaynsViewMode.exclusive);
            removeFooter(false);
        }
        if (adminModeType === AdminModeType.editMap) {
            void setRefreshScrollEnabled(false);
        } else {
            void setRefreshScrollEnabled(true);
        }
    }, [adminModeType]);

    if (adminModeType === AdminModeType.editMap && editingMapId) {
        return (
            <EditorMap mapId={editingMapId} />
        );
    }

    return (
        <div className="tapp">
            <h1>
                Verwaltung
            </h1>
            <p>
                Mit dieser Ansicht kannst du die Roboter und die Stockwerke verwalten. Die Roboter können in dieser Ansicht nicht gesteuert werden.
            </p>
            <RobotsList/>
            <FloorsList/>
        </div>
    );
};

export default AdminMode;
