import React, { useEffect } from 'react';
import { useIsAdminMode } from 'chayns-api';
import AdminMode from './admin/AdminMode';
import { ChaynsViewMode, updateChaynsViewmode } from '../utils/pageSizeHelper';

const App = () => {
    const isAdminMode = useIsAdminMode();

    useEffect(() => {
        updateChaynsViewmode(ChaynsViewMode.exclusive);
    }, []);

    return isAdminMode ? (
        <AdminMode/>
        // <EditorMap
        //     gltfModelsProp={[{
        //         id: 'scenegraphLayer-1',
        //         url: 'https://w-lpinkernell-z.tobit.ag/models/Gross.glb',
        //         position: [23.65, 12.2, 0],
        //         orientation: [0, -5, 90]
        //     }, {
        //         id: 'scenegraphLayer-2',
        //         url: 'https://w-lpinkernell-z.tobit.ag/models/Gltf-Test.glb',
        //         position: [0.6, 1.3, 0],
        //         orientation: [0, 122, 90]
        //     }]}
        //     map={pathData}
        // />
    ) : 'Nutzermodus'
};

export default App;
