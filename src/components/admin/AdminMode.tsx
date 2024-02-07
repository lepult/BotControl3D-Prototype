import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { setRefreshScrollEnabled } from 'chayns-api';
import FloorsList from './floors-list/FloorsList';
import { selectAdminModeType, selectEditingMapId } from '../../redux-modules/misc/selectors';
import { AdminModeType } from '../../types/misc';
import { ChaynsViewMode, removeFooter, updateChaynsViewmode } from '../../utils/pageSizeHelper';
import RobotsList from './robots-list/RobotsList';
import Map from '../map/Map';
import EditorMapButtons from './editor-map-buttons/EditorMapButtons';
import { ModelType } from '../../constants/models';
import { TViewState } from '../../types/deckgl-map';

const AdminMode = () => {
    const adminModeType = useSelector(selectAdminModeType);
    const editingMapId = useSelector(selectEditingMapId);

    const [floorModels, setFloorModels] = useState<ModelType[]>([]);
    const [viewState, setViewState] = useState<TViewState>();

    useEffect(() => {
        if (adminModeType === AdminModeType.default) {
            updateChaynsViewmode(ChaynsViewMode.exclusive);
            removeFooter(false);
        }
        if (adminModeType === AdminModeType.editMap) {
            updateChaynsViewmode(ChaynsViewMode.wide);
            void setRefreshScrollEnabled(false);
        } else {
            void setRefreshScrollEnabled(true);
        }
    }, [adminModeType]);

    if (adminModeType === AdminModeType.editMap && editingMapId) {
        return (
            <div>
                <Map
                    mapId={editingMapId}
                    isEditor
                    setFloorModels={setFloorModels}
                    setViewState={setViewState}
                />
                <EditorMapButtons
                    floorModels={floorModels}
                    viewState={viewState}
                    mapId={editingMapId}
                />
            </div>

        )
        // return (
        //     <EditorMap mapId={editingMapId} />
        // );
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
