import React, { useEffect } from 'react';
import { invokeCall } from 'chayns-api';
import pathData from '../constants/pathData';
import EditorMap from './EditorMap';

const App = () => {

    useEffect(() => {
        void invokeCall({
            action: 266,
            value: {
                updates: [{
                    type: 'tapp',
                    value: {
                        viewMode: 4
                    }
                }]
            }
        });
    }, []);

    return (
        <EditorMap
            gltfModelsProp={[{
                id: 'scenegraphLayer-1',
                url: 'https://w-lpinkernell-z.tobit.ag/models/Gross.glb',
                position: [23.65, 12.2, 0],
                orientation: [0, -5, 90]
            }, {
                id: 'scenegraphLayer-2',
                url: 'https://w-lpinkernell-z.tobit.ag/models/Gltf-Test.glb',
                position: [0.6, 1.3, 0],
                orientation: [0, 122, 90]
            }]}
            pathData={pathData}
        />
    )
};

export default App;
